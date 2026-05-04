let BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
BASE_URL = BASE_URL.replace(/\/+$/, "");
if (!BASE_URL.endsWith("/api")) {
  BASE_URL = `${BASE_URL}/api`;
}


export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

