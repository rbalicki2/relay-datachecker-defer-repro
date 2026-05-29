import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  Environment, Network, Observable, RecordSource, Store, createOperationDescriptor,
} = require('relay-runtime');

const FeedQuery = require('./src/__generated__/FeedQuery.graphql.js');

// ─────────────────────────────────────────────────────────────────────────────
// The bug: DataChecker reports "missing" when client extension fields are
// absent inside an active @defer block.
//
// In production:
// 1. Streaming works correctly — server fields arrive via incremental delivery
// 2. Client extension fields (saved, savedInfo, etc.) are never server-delivered
// 3. DataChecker traverses into the active @defer block
// 4. Inside the defer, it finds missing client extension fields
// 5. ClientExtension case correctly saves/restores _recordWasMissing
// 6. BUT the Defer case itself has no save/restore, so any "missing" state
//    from server fields that haven't arrived yet (or other edge cases) leaks
//    out to the overall check() result
//
// The fix: Defer case should save/restore _recordWasMissing when defer is
// active, just like ClientExtension does.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Approach 1: Streaming (initial + incremental payload) — this is how
// production works. After streaming, server fields are in the store.
// ─────────────────────────────────────────────────────────────────────────────
async function approach1_streaming() {
  const network = Network.create(() =>
    Observable.create(sink => {
      // Initial response (non-deferred fields only)
      sink.next({
        data: {
          feed: {
            edges: [{
              node: {
                __typename: 'Pin',
                id: 'pin-1',
                title: 'Test Pin',
                imageUrl: 'https://example.com/image.png',
              },
            }],
          },
        },
        hasNext: true,
      });
      // Incremental payload for the deferred fragment
      sink.next({
        data: {
          id: 'pin-1',
          __typename: 'Pin',
          description: 'A test description',
          link: 'https://example.com/pin',
        },
        label: 'FeedQuery$defer$PinContextMenu',
        path: ['feed', 'edges', 0, 'node'],
        hasNext: false,
      });
      sink.complete();
    })
  );
  const env = new Environment({ network, store: new Store(new RecordSource()) });
  const op = createOperationDescriptor(FeedQuery, { shouldDefer: true });
  env.retain(op);
  await new Promise((res, rej) =>
    env.execute({ operation: op }).subscribe({ complete: res, error: rej })
  );
  return env;
}

// ─────────────────────────────────────────────────────────────────────────────
// Approach 2: Execute with shouldDefer=false — @defer inactive, all inline.
// ─────────────────────────────────────────────────────────────────────────────
async function approach2_noDeferVariable() {
  const fullResponse = {
    feed: {
      edges: [{
        node: {
          __typename: 'Pin',
          id: 'pin-1',
          title: 'Test Pin',
          imageUrl: 'https://example.com/image.png',
          description: 'A test description',
          link: 'https://example.com/pin',
        },
      }],
    },
  };
  const network = Network.create(() =>
    Observable.create(sink => {
      sink.next({ data: fullResponse });
      sink.complete();
    })
  );
  const env = new Environment({ network, store: new Store(new RecordSource()) });
  const op = createOperationDescriptor(FeedQuery, { shouldDefer: false });
  env.retain(op);
  await new Promise((res, rej) =>
    env.execute({ operation: op }).subscribe({ complete: res, error: rej })
  );
  return env;
}

// ─────────────────────────────────────────────────────────────────────────────
// Approach 3: Execute with shouldDefer=true, check BEFORE incremental arrives.
// This simulates the window where check() is called while streaming is in
// progress — deferred fields haven't arrived yet.
// ─────────────────────────────────────────────────────────────────────────────
async function approach3_checkBeforeIncremental() {
  let sinkRef;
  const network = Network.create(() =>
    Observable.create(sink => {
      sinkRef = sink;
      // Initial response only — don't send the incremental payload yet
      sink.next({
        data: {
          feed: {
            edges: [{
              node: {
                __typename: 'Pin',
                id: 'pin-1',
                title: 'Test Pin',
                imageUrl: 'https://example.com/image.png',
              },
            }],
          },
        },
        hasNext: true,
      });
      // Don't complete — streaming still in progress
    })
  );
  const env = new Environment({ network, store: new Store(new RecordSource()) });
  const op = createOperationDescriptor(FeedQuery, { shouldDefer: true });
  env.retain(op);
  // Start execution but don't await completion (stream is still open)
  env.execute({ operation: op }).subscribe({});
  // Give it a tick to process
  await new Promise(r => setTimeout(r, 0));
  return { env, sinkRef };
}

// ─────────────────────────────────────────────────────────────────────────────
// Run all approaches and compare
// ─────────────────────────────────────────────────────────────────────────────

console.log('=== Approach 1: Streaming completed (initial + incremental payload) ===');
console.log('    Simulates production: streaming works, server fields arrive.');
const env1 = await approach1_streaming();
const op1 = createOperationDescriptor(FeedQuery, { shouldDefer: true });
console.log('  Store pin-1:', JSON.stringify(env1.getStore().getSource().get('pin-1')));
console.log(`  check(shouldDefer:true)  → ${env1.check(op1).status}`);
console.log('  NOTE: Client extension fields (saved, savedInfo) are absent but');
console.log('  should NOT cause check() to return "missing".');

console.log('');
console.log('=== Approach 2: shouldDefer=false (all fields inline, no @defer) ===');
const env2 = await approach2_noDeferVariable();
const op2_true = createOperationDescriptor(FeedQuery, { shouldDefer: true });
const op2_false = createOperationDescriptor(FeedQuery, { shouldDefer: false });
console.log('  Store pin-1:', JSON.stringify(env2.getStore().getSource().get('pin-1')));
console.log(`  check(shouldDefer:true)  → ${env2.check(op2_true).status}`);
console.log(`  check(shouldDefer:false) → ${env2.check(op2_false).status}`);

console.log('');
console.log('=== Approach 3: shouldDefer=true, check BEFORE incremental arrives ===');
console.log('    Deferred fields have not arrived yet — defer is active.');
const { env: env3 } = await approach3_checkBeforeIncremental();
const op3 = createOperationDescriptor(FeedQuery, { shouldDefer: true });
console.log('  Store pin-1:', JSON.stringify(env3.getStore().getSource().get('pin-1')));
console.log(`  check(shouldDefer:true)  → ${env3.check(op3).status}`);
console.log('  With fix: should be "available" (defer is active, missing fields expected)');
console.log('  Without fix: "missing" (deferred field absence leaks out)');
