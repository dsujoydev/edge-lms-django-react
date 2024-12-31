import api from "./api";

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await api.post("/api/users/token/refresh/", { refresh: refreshToken });
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export async function fetchUserProfile() {
  try {
    const response = await api.get("/api/users/profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const response = await api.post("/api/users/token/", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: string;
}) {
  try {
    const response = await api.post("/api/users/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
