// services/authServices.ts
import fetcher from "../api/fetcher";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

export const authServices = {
  login: (user: LoginRequest): Promise<LoginResponse> =>
    fetcher.post("/auth/signin", user).then((res) => res.data),

  register: (user: RegisterRequest): Promise<RegisterResponse> =>
    fetcher.post("/auth/signup", user).then((res) => res.data),
};
