# Bug: `environment.check()` reports "missing" when client extension fields are absent inside active `@defer` blocks

## Summary

When a query uses `@defer`, the `DataChecker` (used by `environment.check()`) traverses into the deferred selections unconditionally. If client extension fields inside the `@defer` block are absent (which is expected — they're never server-delivered), or if the incremental payload hasn't arrived yet, the "missing" status leaks out to the overall `check()` result.

This causes `environment.check()` to return `"missing"` even though:
- Streaming completed successfully and all server-delivered fields are in the store
- The UI renders correctly (data is available via fragment reads)
- The only "missing" fields are client extensions that are never server-delivered

## Impact

In production, this causes unnecessary refetches. The data is fully available for rendering, but Relay's cache check reports the operation as incomplete, triggering redundant network requests. With 12+ pins each containing ~56 client extension fields inside `@defer` blocks, this produces 728 false "missing" fields.

## Root Cause

**File:** `relay-runtime/store/DataChecker.js`, lines 251–254

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

When `@defer` is active, any fields inside the block that are missing (whether client extensions or server fields not yet delivered via incremental payload) should not cause the overall `check()` to report "missing" — because those fields are expected to arrive via incremental delivery.

## Reproduction

```
npm install
npm run relay
npm run repro
```

**Output (without fix):**
```
=== Approach 3: shouldDefer=true, check BEFORE incremental arrives ===
    Deferred fields have not arrived yet — defer is active.
  Store pin-1: {"__id":"pin-1","__typename":"Pin","id":"pin-1","title":"Test Pin","imageUrl":"https://example.com/image.png"}
  check(shouldDefer:true)  → missing
  With fix: should be "available" (defer is active, missing fields expected)
  Without fix: "missing" (deferred field absence leaks out)
```

**Output (with fix):**
```
  check(shouldDefer:true)  → available
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
    // Defer is active: fields may arrive via incremental delivery.
    // Their absence should not cause check() to return "missing".
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
