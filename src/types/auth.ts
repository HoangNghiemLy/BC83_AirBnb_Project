import type dayjs from "dayjs";
import type { User } from "./User";

// Đăng nhập
export interface LoginRequest {
  email: string;
  password: string;
}

// Đăng ký
export interface RegisterRequest {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string | null;
  gender: boolean | null;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  content: {
    user: User;
    token: string;
  };
}
export type RegisterResponse = LoginResponse;
export interface TempFormRegisterProps {
  onRegisterSuccess?: () => void;
}

export interface FormValues {
  id: 0;
  name: string;
  email: string;
  password: string;
  countryCode: string;
  phone: string;
  birthday: dayjs.Dayjs;
  gender: "male" | "female" | "other";
  role: "user";
  avatar?: string;
}
