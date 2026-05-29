# Bug: `environment.check()` incorrectly returns "missing" when client extension fields are inside `@defer`

## Summary

`environment.check()` returns `{status: 'missing'}` when a deferred fragment contains client extension fields, even though all server-delivered data is present in the store. Client extension fields are never server-delivered and should not affect the check result.

## Root Cause

**File:** `packages/relay-runtime/store/DataChecker.js`

The `Defer` case does not save/restore `_recordWasMissing`, so any "missing" state from traversing inside the defer block leaks out:

```javascript
case 'Defer':
case 'Stream':
  this._traverseSelections(selection.selections, dataID);
  break;
```

Compare with `ClientExtension` which correctly isolates:

```javascript
case 'ClientExtension': {
  const recordWasMissing = this._recordWasMissing;
  this._traverseSelections(selection.selections, dataID);
  this._recordWasMissing = recordWasMissing;
  break;
}
```

## Fix

```javascript
case 'Defer':
case 'Stream': {
  const isDeferred =
    selection.if == null ||
    Boolean(this._getVariableValue(selection.if));
  if (isDeferred) {
    const prevRecordWasMissing = this._recordWasMissing;
    this._traverseSelections(selection.selections, dataID);
    this._recordWasMissing = prevRecordWasMissing;
  } else {
    this._traverseSelections(selection.selections, dataID);
  }
  break;
}
```

When `@defer` is inactive (`if: false`), fields are expected inline and their absence is genuinely "missing".

## Reproduction

```
npm install
npm run relay
npm run repro
```

## Repositories

- **Reproduction:** https://github.com/rbalicki2/relay-datachecker-defer-repro
- **Fix branch:** https://github.com/rbalicki2/relay/tree/fix/datachecker-defer-missing-status

## Environment

- `relay-runtime`: 17.0.0
- Node.js
