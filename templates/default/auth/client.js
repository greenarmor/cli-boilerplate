const API_URL = '';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error('Login failed');
  const { token } = await res.json();
  localStorage.setItem('token', token);
  return token;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}), Authorization: token ? `Bearer ${token}` : undefined };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    logout();
  }
  return res;
}

export default { login, getToken, logout, fetchWithAuth };
