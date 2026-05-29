# store.check() reports client extension fields as "missing" when query uses @defer, triggering unnecessary refetch

## Summary

When a query uses `@defer` with incremental delivery (streaming), `store.check()` reports client schema extension fields as missing on records delivered via the stream. This causes Relay to evaluate the operation as `"missing"` and trigger a full network refetch, even though the data is complete — the "missing" fields are client extensions that are never sent by the server by design.

This does **not** happen for non-deferred queries.

## Minimal Reproduction

### Schema extension (client-only fields)

```graphql
# client-schema-extension.graphql
extend type Pin {
  saved: Boolean
  savedInfo: SaveTarget
  feedbackText: FeedbackText
}
```

### Fragment that reads the client extension

```graphql
# PinCard_pin.graphql
fragment PinCard_pin on Pin {
  id
  title
  imageUrl
  saved        # client extension
  savedInfo {  # client extension
    boardId
  }
}
```

### Query with @defer

```graphql
# FeedQuery.graphql
query FeedQuery($shouldDefer: Boolean!) {
  feed {
    edges {
      node {
        ...PinCard_pin
        ... @defer(if: $shouldDefer, label: "FeedQuery$defer$PinContextMenu") {
          ...PinContextMenu_pin
        }
      }
    }
  }
}
```

### Environment setup

```typescript
const environment = new Environment({
  network: Network.create(fetchFn),
  store: new Store(new RecordSource()),
});
```

### Observed behavior

1. `FeedQuery` is fetched with `shouldDefer: true`
2. The server streams two SSE payloads:
   - Initial payload: all non-deferred Pin fields (`id`, `title`, `imageUrl`, etc.)
   - Deferred payload: `PinContextMenu_pin` fragment data
3. After the stream completes, Relay calls `store.check()` on the operation
4. `store.check()` walks the normalization AST, encounters the `ClientExtension` node, and checks for `saved` and `savedInfo` on every Pin record
5. These fields are `undefined` in the store (they were never written — they're client-only)
6. `store.check()` returns `{status: "missing"}` with all client extension fields listed
7. Relay interprets this as incomplete data and issues a full network refetch

### Expected behavior

`store.check()` should treat `ClientExtension` fields as satisfied (or skip them entirely) — the server never sends them regardless of `@defer`. The query's server-side data is complete; the missing fields are client-local and should not trigger a refetch.

### Why this works without @defer

For non-deferred queries, `fetchQuery` returns the response synchronously (or as a single promise). The Relay store processes the response and the component renders in one pass. The `store.check()` that gates re-fetching either doesn't run in the same code path, or the timing means the store is already "committed" by the time availability is checked.

With `@defer` + streaming, the operation is re-evaluated after each incremental chunk arrives. The final `store.check()` after the stream completes hits the `ClientExtension` node and finds no data, returning `"missing"`.

## Impact

Every Pin record in the streamed response contributes ~26 "missing" field entries (client extension fields × records). A feed with 28 pins produces 728 missing fields, causing:
- A full redundant refetch of the entire query over the network
- Doubled server load for every streamed query
- Negates the latency benefit of `@defer` (user waits for the refetch anyway)

## Environment

- `relay-runtime`: 17.0.0
- `react-relay`: 17.0.0
- Streaming via SSE with incremental delivery spec (`hasNext`, `incremental[]`, `completed[]`)
- `deferDeduplicatedFields: true` on Environment (same behavior without it)

## Suggested fix

In `DataChecker` (or equivalent `store.check()` logic), when encountering a `ClientExtension` kind node, treat it as available/satisfied rather than checking the store for those fields. Client extensions are never part of the server response and their absence should not affect the operation's availability status.

Alternatively, mark `ClientExtension` selections with a flag that `store.check()` can use to skip availability checks, similar to how `@relay(plural: true)` or other directives modify checker behavior.
