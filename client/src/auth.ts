import axios from 'axios';

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

// Login or signup: returns accessToken, sets refresh-token cookie
export async function loginOrSignup({ username, password, url }: { username: string, password: string, url: string }) {
  const response = await axios.post(url, { username, password }, { withCredentials: true });
  setAccessToken((response.data as { accessToken: string }).accessToken);
  return response;
}

// Refresh access token using refresh-token cookie
export async function refreshAccessToken(BACKEND_URL: string) {
  const response = await axios.post(`${BACKEND_URL}/second-brain/api/auth/refresh-token`, {}, { withCredentials: true });
  setAccessToken((response.data as { accessToken: string }).accessToken);
  return (response.data as { accessToken: string }).accessToken;
}

// Logout: clear access token and refresh-token cookie
export async function logout(BACKEND_URL: string) {
  clearAccessToken();
  await axios.post(`${BACKEND_URL}/second-/api/brain/logout`, {}, { withCredentials: true });
} 