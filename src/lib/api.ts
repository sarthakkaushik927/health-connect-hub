const API_BASE_URL = "http://localhost:5000";

export interface SignupData {
  name: string;
  email: string;
  phone: number;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OtpSendData {
  phone: number;
}

export interface OtpVerifyData {
  phone: number;
  otp: number;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  signup: (data: SignupData) =>
    request<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    request<{ message: string; token: string; name: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendOtp: (data: OtpSendData) =>
    request<{ message: string }>("/otp/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyOtp: (data: OtpVerifyData) =>
    request<{ message: string }>("/otp/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
