const assert = require('node:assert/strict');
const test = require('node:test');

const { requireAdmin, authenticateToken } = require('../middleware/auth');

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

test('authenticateToken rejects requests without a bearer token', () => {
  const req = { get: () => undefined };
  const res = responseRecorder();
  let nextCalled = false;

  authenticateToken(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Authentication required');
  assert.equal(nextCalled, false);
});

test('authenticateToken rejects malformed tokens', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret-for-auth-middleware-32-chars';

  try {
    const req = { get: () => 'Bearer not-a-valid-token' };
    const res = responseRecorder();
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

test('authenticateToken refuses to verify tokens without a strong configured secret', () => {
  const previousSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  try {
    const req = { get: () => 'Bearer any-token' };
    const res = responseRecorder();
    let nextCalled = false;

    authenticateToken(req, res, () => { nextCalled = true; });

    assert.equal(res.statusCode, 503);
    assert.equal(res.body.message, 'Authentication is not configured');
    assert.equal(nextCalled, false);
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});
