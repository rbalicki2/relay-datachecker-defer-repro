# Bug: `environment.check()` reports "missing" when client extension fields are absent inside active `@defer` blocks

## Summary

When a query uses `@defer`, the `DataChecker` (used by `environment.check()`) traverses into the deferred selections unconditionally. Client extension fields inside the `@defer` block are legitimately absent (they're never server-delivered), but their "missing" status leaks out to the overall `check()` result.

This causes `environment.check()` to return `"missing"` even though:
- Streaming completed successfully and all server-delivered fields are in the store
- The UI renders correctly (data is available via fragment reads)
- The only "missing" fields are client extensions that are never server-delivered

## Impact

In production, this causes unnecessary refetches. The data is fully available for rendering, but Relay's cache check reports the operation as incomplete, triggering redundant network requests. With 12+ pins each containing ~56 client extension fields inside `@defer` blocks, this produces 728 false "missing" fields.

## Root Cause

**File:** `relay-runtime/store/DataChecker.js`

```javascript
case 'Defer':
case 'Stream':
  this._traverseSelections(selection.selections, dataID);
  break;
```

The `Defer` case unconditionally traverses into deferred selections **without saving/restoring `_recordWasMissing`**. Compare with the `ClientExtension` case which correctly isolates missing fields:

```javascript
case CLIENT_EXTENSION:
  var recordWasMissing = this._recordWasMissing;
  this._traverseSelections(selection.selections, dataID);
  this._recordWasMissing = recordWasMissing;
  break;
```

When `@defer` is active, client extension fields inside the block are expected to be absent. Their "missing" status should not propagate to the overall `check()` result.

## Reproduction

```
npm install
npm run relay
npm run repro
```

## Fix

Save/restore `_recordWasMissing` when `@defer` is active, mirroring what `ClientExtension` already does:

```javascript
case 'Defer':
case 'Stream': {
  const isDeferred =
    selection.if == null ||
    Boolean(this._getVariableValue(selection.if));
  if (isDeferred) {
    // Defer is active: client extension fields inside are expected to
    // be absent. Their missing status should not propagate.
    const prevRecordWasMissing = this._recordWasMissing;
    this._traverseSelections(selection.selections, dataID);
    this._recordWasMissing = prevRecordWasMissing;
  } else {
    // Defer is inactive (if: false): fields are expected inline.
    this._traverseSelections(selection.selections, dataID);
  }
  break;
}
```

When `@defer(if: $var)` has `$var = false` (defer inactive), fields are expected inline and their absence is a real "missing".

## Repositories

- **Reproduction:** https://github.com/rbalicki2/relay-datachecker-defer-repro
- **Fix branch:** https://github.com/rbalicki2/relay/tree/fix/datachecker-defer-missing-status

## Environment

- `relay-runtime`: 17.0.0 (also confirmed on `0.0.0-main-531c3803`)
- Node.js (no browser/React needed to reproduce)

## Production Scenario

```graphql
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

Where `PinContextMenu_pin` contains client extension fields (`saved`, `savedInfo`, `adTargetingAttribution` sub-fields, etc.) that are never server-delivered. After streaming completes, all server data is present, but `check()` reports "missing" due to these client extension fields inside the `@defer` block.
