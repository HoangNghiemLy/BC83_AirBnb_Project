import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { BASE_URL_API, TOKEN_CYBERSOFT } from "../constants/config";

const fetcher: AxiosInstance = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
});

fetcher.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const user = localStorage.getItem("user");
    const token: string | null = user ? JSON.parse(user)?.accessToken : null;

    if (token) {
      config.headers.set?.("Authorization", `Bearer ${token}`);
    }

    return config;
  } catch (error) {
    console.error("Lỗi xử lý token:", error);
    return config;
  }
});

export default fetcher;
