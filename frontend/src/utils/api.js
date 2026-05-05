// Base URL for all API calls
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Helper: get auth token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper: make an authenticated API request
const request = async (method, path, body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // Add auth token if we have one
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Throw the error message from the server
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// ─── Auth API ──────────────────────────────────────────────
export const authAPI = {
  register: (body) => request("POST", "/auth/register", body),
  login: (body) => request("POST", "/auth/login", body),
  getMe: () => request("GET", "/auth/me"),
  updateMe: (body) => request("PATCH", "/auth/me", body),
};

// ─── Streams API ───────────────────────────────────────────
export const streamsAPI = {
  getAll: (category) => request("GET", `/streams${category ? `?category=${category}` : ""}`),
  getLive: (category) => request("GET", `/streams/live${category ? `?category=${category}` : ""}`),
  getById: (id) => request("GET", `/streams/${id}`),
  getMyStream: () => request("GET", "/streams/user/me"),
  updateMyStream: (body) => request("PATCH", "/streams/user/me", body),
  regenerateKey: () => request("POST", "/streams/user/me/regenerate-key"),
  getMessages: (id) => request("GET", `/streams/${id}/messages`),
};
