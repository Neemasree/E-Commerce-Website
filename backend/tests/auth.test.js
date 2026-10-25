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

const { authenticateToken } = require('../middleware/auth');

function authResponseRecorder() {
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

test('authenticateToken rejects requests without a bearer token', () => {
  const req = { get: () => undefined };
  const res = authResponseRecorder();
  let nextCalled = false;

  authenticateToken(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Authentication required');
  assert.equal(nextCalled, false);
});

test('authenticateToken rejects malformed or expired tokens', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret-for-auth-middleware-32-chars';

  try {
    const req = { get: () => 'Bearer not-a-valid-token' };
    const res = authResponseRecorder();
    let nextCalled = false;

    authenticateToken(req, res, () => { nextCalled = true; });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, 'Invalid or expired token');
    assert.equal(nextCalled, false);
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});
