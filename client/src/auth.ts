import axios from 'axios';
import { toast } from 'react-toastify'

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

export async function SignupFunction({ name, username, password, url }: { name?: string, username: string, password: string, url: string }) {
  const response = await axios.post(url, { name, username, password }, { withCredentials: true });
  setAccessToken((response.data as { accessToken: string }).accessToken);
  return response;
}

export async function SigninFunction({ username, password, url }: { username: string, password: string, url: string }) {
  const response = await axios.post(url, { username, password }, { withCredentials: true });
  setAccessToken((response.data as { accessToken: string }).accessToken);
  return response;
}

export async function refreshAccessToken(BACKEND_URL: string) {
  const response = await axios.post(`${BACKEND_URL}/second-brain/api/auth/refresh-token`, {}, { withCredentials: true });
  setAccessToken((response.data as { accessToken: string }).accessToken);
  return (response.data as { accessToken: string }).accessToken;
}

export async function logout(BACKEND_URL: string) {
  const response = await axios.post<{ message: string }>(`${BACKEND_URL}/second-brain/api/auth/logout`, {}, { withCredentials: true });
  clearAccessToken();
  toast.success(response.data?.message)
} 