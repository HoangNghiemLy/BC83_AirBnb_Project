import type { Booking } from "./Booking";
import type { Phong } from "./Phong";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  birthday: string;
  avatar?: string;
  gender: boolean;
  role: "USER" | "ADMIN" | string;
}

export interface PaginatedUserContent {
  data: User[];
  totalRow: number;
  pageIndex: number;
}
export interface UserSlice {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
}

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "USER" | "GOOGLE";
}
export interface EditUserRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: string;
}

export interface UploadAvatarResponse {
  statusCode: number;
  dateTime: string;
  content: {
    avatar: string;
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
  };
}

export interface DefaultResponse {
  message: string;
}
export interface ApiResponse<T> {
  statusCode: number;
  content: T;
  dateTime: string;
}
export interface InfoUserState {
  infoUser: User | Record<string, never>;
  listBooked: Booking[];
  listIdBooking: number[];
  listBookedRoom: Phong[];
  isModalUpHinhOpen: boolean;
  isModalEditOpen: boolean;
}
export interface UserState {
  loginData: UserSlice | null;
  isModalOpen: boolean;
  modalContent: "login" | "register";
}
