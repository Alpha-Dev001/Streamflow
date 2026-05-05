const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const request = async (method, path, body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
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
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const authAPI = {
  register: (body) => request("POST", "/api/auth/register", body),
  login: (body) => request("POST", "/api/auth/login", body),
  getMe: () => request("GET", "/api/auth/me"),
  updateMe: (body) => request("PATCH", "/api/auth/me", body),
};
export const streamsAPI = {
  getAll: (category) => request("GET", `/api/streams${category ? `?category=${category}` : ""}`),
  getLive: (category) => request("GET", `/api/streams/live${category ? `?category=${category}` : ""}`),
  getById: (id) => request("GET", `/api/streams/${id}`),
  getMyStream: () => request("GET", "/api/streams/user/me"),
  updateMyStream: (body) => request("PATCH", "/api/streams/user/me", body),
  regenerateKey: () => request("POST", "/api/streams/user/me/regenerate-key"),
  getMessages: (id) => request("GET", `/api/streams/${id}/messages`),
};
