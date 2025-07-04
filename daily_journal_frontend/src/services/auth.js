//
// Authentication service for login/register, JWT storage, and utilities.
//

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'journal_jwt_token';

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Stores JWT to localStorage. */
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Retrieves JWT from localStorage. */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Removes JWT from localStorage. */
  localStorage.removeItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  /** Logs in user, returns JWT or throws error. */
  const resp = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!resp.ok) {
    const detail = await resp.json().catch(() => ({}));
    throw new Error(detail?.detail || 'Login failed');
  }
  const data = await resp.json();
  if (!data.access_token) throw new Error('JWT not found in response');
  setToken(data.access_token);
  return data.access_token;
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  /** Registers user, returns JWT or throws error. */
  const resp = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!resp.ok) {
    const detail = await resp.json().catch(() => ({}));
    throw new Error(detail?.detail || 'Registration failed');
  }
  const data = await resp.json();
  if (!data.access_token) throw new Error('JWT not found in response');
  setToken(data.access_token);
  return data.access_token;
}

// PUBLIC_INTERFACE
export function isLoggedIn() {
  /** Returns true if JWT token exists. */
  return !!getToken();
}
