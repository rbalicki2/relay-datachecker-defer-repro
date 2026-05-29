import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const {
  Environment, Network, Observable, RecordSource, Store, createOperationDescriptor,
} = require('relay-runtime');

const UserQuery = require('./src/__generated__/UserQuery.graphql.js');

// Populate store with initial payload (non-deferred fields only).
// Deferred fields (email, bio, nickname) have NOT arrived yet.
function makeEnvWithInitialPayload() {
  const source = new RecordSource();
  source.set('client:root', {
    __id: 'client:root',
    __typename: '__Root',
    'user(id:"1")': { __ref: '1' },
  });
  source.set('1', {
    __id: '1',
    __typename: 'User',
    id: '1',
    name: 'Alice',
    // email, bio NOT present (inside active @defer, not yet delivered)
    // nickname NOT present (client extension, never server-delivered)
  });

  const store = new Store(source);
  const network = Network.create(() => Observable.create(() => {}));
  return new Environment({ network, store });
}

// --- Test 1: @defer active (shouldDefer: true) ---
// Only initial fields present. Deferred fields absent. Client extension absent.
// Expected: "available" (deferred content hasn't arrived yet, that's fine)
// Actual (without fix): "missing"
const env1 = makeEnvWithInitialPayload();
const op1 = createOperationDescriptor(UserQuery, { id: '1', shouldDefer: true });
env1.retain(op1);
const result1 = env1.check(op1);
console.log(`@defer active, deferred fields absent: check() = "${result1.status}"`);
console.log(`  Expected: "available"  Got: "${result1.status}"  ${result1.status === 'available' ? 'PASS' : 'FAIL (BUG)'}`);

console.log('');

// --- Test 2: @defer inactive (shouldDefer: false) ---
// Fields are expected inline. Their absence IS genuinely missing.
// Expected: "missing"
const env2 = makeEnvWithInitialPayload();
const op2 = createOperationDescriptor(UserQuery, { id: '1', shouldDefer: false });
env2.retain(op2);
const result2 = env2.check(op2);
console.log(`@defer inactive, fields absent: check() = "${result2.status}"`);
console.log(`  Expected: "missing"  Got: "${result2.status}"  ${result2.status === 'missing' ? 'PASS' : 'FAIL'}`);
