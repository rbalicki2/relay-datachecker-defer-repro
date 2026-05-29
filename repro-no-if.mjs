import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  Environment, Network, Observable, RecordSource, Store, createOperationDescriptor,
} = require('relay-runtime');

const FeedQuery = require('./src/__generated__/FeedQuery.graphql.js');

// Test: does the DataChecker bug exist when @defer has NO `if` parameter?
// We'll manually populate the store (simulating post-initial-payload state)
// and then call check() with a patched operation AST that has no `if` on Defer.

// Patch: remove `if` from the Defer node in operation AST
const patchedQuery = JSON.parse(JSON.stringify(FeedQuery));
function removeDeferIf(selections) {
  for (const sel of selections) {
    if (sel.kind === 'Defer') {
      delete sel.if;
    }
    if (sel.selections) removeDeferIf(sel.selections);
  }
}
removeDeferIf(patchedQuery.operation.selections);

// Populate store with initial payload state (deferred fields NOT yet delivered)
const source = new RecordSource();
source.set('client:root', {
  __id: 'client:root',
  __typename: '__Root',
  feed: { __ref: 'client:feed' },
});
source.set('client:feed', {
  __id: 'client:feed',
  __typename: 'FeedConnection',
  edges: { __refs: ['client:feed:edge:0'] },
});
source.set('client:feed:edge:0', {
  __id: 'client:feed:edge:0',
  __typename: 'FeedEdge',
  node: { __ref: 'pin-1' },
});
source.set('pin-1', {
  __id: 'pin-1',
  __typename: 'Pin',
  id: 'pin-1',
  title: 'Test Pin',
  imageUrl: 'https://example.com/image.png',
  // description and link NOT present (deferred, hasn't arrived)
});

const store = new Store(source);
const network = Network.create(() => Observable.create(() => {}));
const env = new Environment({ network, store });

const op = createOperationDescriptor(patchedQuery, { shouldDefer: true });
env.retain(op);

console.log('=== @defer WITHOUT `if` (unconditional, always active) ===');
console.log('    Store has initial fields but NOT deferred fields.');
console.log('    DataChecker is UNFIXED (original code).\n');
console.log('  Store pin-1:', JSON.stringify(source.get('pin-1')));

const result = env.check(op);
console.log(`  check() → ${result.status}`);
console.log('');
if (result.status === 'missing') {
  console.log('  ✗ BUG EXISTS without `if` parameter too.');
  console.log('    Unconditional @defer (no `if`) also leaks missing status.');
} else {
  console.log('  ✓ Bug does NOT exist without `if` parameter.');
}
