import type { AxiosResponse } from "axios";
import type {
  User,
  EditUserRequest,
  UploadAvatarResponse,
  DefaultResponse,
  ApiResponse,
  PaginatedUserContent,
} from "../types/User";
import fetcher from "../api/fetcher";

export const nguoiDungServices = {
  getListUser: (): Promise<AxiosResponse<User[]>> => fetcher.get("/users"),
  getListUserAdmin: (): Promise<AxiosResponse<{ content: User[] }>> =>
    fetcher.get("/users"),
  getListUserGoole: (): Promise<AxiosResponse<{ content: User[] }>> =>
    fetcher.get("/users"),

  getUserInfo: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    fetcher.get(`/users/${id}`),

  editUser: (
    id: number,
    userInfo: EditUserRequest
  ): Promise<AxiosResponse<DefaultResponse>> =>
    fetcher.put(`/users/${id}`, userInfo),

  uploadHinhUser: (
    formFile: FormData,
    tokenBearer: string
  ): Promise<AxiosResponse<UploadAvatarResponse>> =>
    fetcher.post(`/users/upload-avatar`, formFile, {
      headers: { token: tokenBearer },
    }),
  findUser: (
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<AxiosResponse<ApiResponse<PaginatedUserContent>>> =>
    fetcher.get(
      `/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),
  deleteUser: (id: number | string) => fetcher.delete(`/users?id=${id}`),
  createUser: (user: User) => fetcher.post(`/users`, user),
};
