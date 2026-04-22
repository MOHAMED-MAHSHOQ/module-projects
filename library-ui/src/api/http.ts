import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 15000
});

export function attachAccessToken(token: string | null): void {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}

