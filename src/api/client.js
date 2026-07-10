import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://amor008.herokuapp.com"
    : "http://localhost:8080");

export const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || API_URL;

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/** Attach uid to every authenticated request. */
export function withUid(uid) {
  return {
    headers: { "X-User-Id": uid },
    params: { uid },
  };
}

export default client;
