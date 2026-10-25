const assert = require('node:assert/strict');
const test = require('node:test');

const { requireAdmin } = require('../middleware/auth');

function responseRecorder() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('requireAdmin rejects requests without an authenticated user', () => {
  const req = {};
  const res = responseRecorder();
  let nextCalled = false;

  requireAdmin(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 403);
  assert.equal(res.body.message, 'Admin access required');
  assert.equal(nextCalled, false);
});

test('requireAdmin rejects authenticated non-admin users', () => {
  const req = { user: { id: 'user-1', role: 'user' } };
  const res = responseRecorder();
  let nextCalled = false;

  requireAdmin(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('requireAdmin allows admin users to continue', () => {
  const req = { user: { id: 'admin-1', role: 'admin' } };
  const res = responseRecorder();
  let nextCalled = false;

  requireAdmin(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});
