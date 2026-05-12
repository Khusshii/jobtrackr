import { test, expect } from '@playwright/test';

const API = 'http://localhost:3001/api';

// =============================================
// AUTH API TESTS
// =============================================

test.describe('Auth API', () => {

  test('POST /auth/register creates user and returns JWT', async ({ request }) => {
    const res = await request.post(`${API}/auth/register`, {
      data: {
        name: 'API Test User',
        email: `api${Date.now()}@test.com`,
        password: 'test1234'
      }
    });
    
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email');
    
    // JWT format: header.payload.signature (3 parts)
    expect(body.token.split('.')).toHaveLength(3);
  });

  test('POST /auth/register rejects duplicate email', async ({ request }) => {
    const email = `dup${Date.now()}@test.com`;
    
    // First registration succeeds
    await request.post(`${API}/auth/register`, {
      data: { name: 'First', email, password: 'test1234' }
    });
    
    // Second with same email fails
    const res = await request.post(`${API}/auth/register`, {
      data: { name: 'Second', email, password: 'test1234' }
    });
    
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/already in use/i);
  });

  test('POST /auth/register rejects short password', async ({ request }) => {
    const res = await request.post(`${API}/auth/register`, {
      data: {
        name: 'Short',
        email: `short${Date.now()}@test.com`,
        password: '123'
      }
    });
    
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/6 characters/i);
  });

  test('POST /auth/register rejects missing fields', async ({ request }) => {
    const res = await request.post(`${API}/auth/register`, {
      data: { email: `incomplete${Date.now()}@test.com` }
    });
    
    expect(res.status()).toBe(400);
  });

  test('POST /auth/login with valid credentials returns token', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'test1234' }
    });
    
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe('test@test.com');
  });

  test('POST /auth/login with wrong password returns 400', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'wrongpass' }
    });
    
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid/i);
  });

  test('GET /auth/me requires authentication', async ({ request }) => {
    const res = await request.get(`${API}/auth/me`);
    expect(res.status()).toBe(401);
  });

});

// =============================================
// JOBS API TESTS
// =============================================

test.describe('Jobs API', () => {
  let token;
  let createdJobId;

  // Login once before all tests in this describe block
  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'test1234' }
    });
    token = (await res.json()).token;
  });

  test('GET /jobs returns jobs array for authenticated user', async ({ request }) => {
    const res = await request.get(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('jobs');
    expect(Array.isArray(body.jobs)).toBe(true);
  });

  test('POST /jobs creates a new job', async ({ request }) => {
    const res = await request.post(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        company: `API Co ${Date.now()}`,
        role: 'Backend Engineer'
      }
    });
    
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.job).toHaveProperty('id');
    expect(body.job.role).toBe('Backend Engineer');
    expect(body.job.status).toBe('applied');  // default
    
    createdJobId = body.job.id;
  });

  test('POST /jobs without company returns 400', async ({ request }) => {
    const res = await request.post(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { role: 'No company provided' }
    });
    
    expect(res.status()).toBe(400);
  });

  test('PUT /jobs/:id updates job status', async ({ request }) => {
    const res = await request.put(`${API}/jobs/${createdJobId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        company: 'Updated Co',
        role: 'Backend Engineer',
        status: 'interview'
      }
    });
    
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.job.status).toBe('interview');
    expect(body.job.company).toBe('Updated Co');
  });

  test('PUT /jobs/:id with fake id returns 404', async ({ request }) => {
    const res = await request.put(`${API}/jobs/fake-id-12345`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { company: 'X', role: 'Y' }
    });
    
    expect(res.status()).toBe(404);
  });

  test('DELETE /jobs/:id removes the job', async ({ request }) => {
    const res = await request.delete(`${API}/jobs/${createdJobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    expect(res.status()).toBe(200);
  });

});

// =============================================
// JWT SECURITY TESTS
// =============================================

test.describe('JWT Security', () => {

  test('GET /jobs without token returns 401', async ({ request }) => {
    const res = await request.get(`${API}/jobs`);
    expect(res.status()).toBe(401);
  });

  test('GET /jobs with malformed token returns 401', async ({ request }) => {
    const res = await request.get(`${API}/jobs`, {
      headers: { Authorization: 'Bearer not-a-real-jwt' }
    });
    expect(res.status()).toBe(401);
  });

  test('GET /jobs with tampered token returns 401', async ({ request }) => {
    // Get a valid token first
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'test1234' }
    });
    const { token } = await loginRes.json();
    
    // Tamper with the signature (last 4 chars)
    const tamperedToken = token.slice(0, -4) + 'XXXX';
    
    const res = await request.get(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${tamperedToken}` }
    });
    
    expect(res.status()).toBe(401);
  });

  test('JWT payload contains userId and expiration', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'test1234' }
    });
    const { token } = await res.json();
    
    // Decode the JWT payload (middle part, base64-encoded)
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    
    expect(payload).toHaveProperty('userId');
    expect(payload).toHaveProperty('exp');
    
    // Expiration should be in the future
    expect(payload.exp * 1000).toBeGreaterThan(Date.now());
  });

  test('Missing Bearer prefix returns 401', async ({ request }) => {
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: 'test@test.com', password: 'test1234' }
    });
    const { token } = await loginRes.json();
    
    // Send token WITHOUT "Bearer " prefix
    const res = await request.get(`${API}/jobs`, {
      headers: { Authorization: token }
    });
    
    expect(res.status()).toBe(401);
  });

});
