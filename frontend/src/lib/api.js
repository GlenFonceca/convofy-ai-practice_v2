import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/users/me");
    return res.data;
  } catch (error) {
    //console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axiosInstance.post("/auth/update-profile", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function uploadSpeech(formData) {
  try {
    const response = await axiosInstance.post("/speech/upload", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Upload failed" };
  }
}


export async function getTestHistory() {
  try {
    const response = await axiosInstance.get("/speech/get-test-history");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Cannot Get Test History" };
  }
}

export async function getPaymentURL({email,plan}) {
  try {
    const response = await axiosInstance.post("/payment/create-checkout-session",{email,plan});
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Cannot Get Payment URL" };
  }
  
}