import fetcher from "../api/fetcher";
import type { Phong, ApiResponse, CreatePhongDto } from "../types/Phong";
import type { AxiosResponse } from "axios";
export const phongServices = {
  // Lấy danh sách tất cả phòng
  getListPhong: (): Promise<ApiResponse<Phong[]>> =>
    fetcher.get(`/phong-thue`).then((res) => res.data),

  // Phân trang + tìm kiếm
  findPhong: (
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<ApiResponse<Phong[]>> =>
    fetcher.get(
      `/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),

  findPhongAdmin: (
    pageIndex: number,
    pageSize: number,
    keyword: string
  ): Promise<AxiosResponse<ApiResponse<{ data: Phong[]; totalRow: number }>>> =>
    fetcher.get(
      `/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),

  // Lấy phòng theo vị trí
  locationPhong: (id: number | string): Promise<ApiResponse<Phong[]>> =>
    fetcher
      .get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${id}`)
      .then((res) => res.data),

  // Xoá phòng
  deletePhong: (
    id: number | string,
    tokenBearer: string
  ): Promise<ApiResponse<void>> =>
    fetcher.delete(`/phong-thue/${id}`, {
      headers: { token: tokenBearer },
    }),

  // Lấy thông tin phòng chi tiết
  getPhongInfo: (id: number | string): Promise<ApiResponse<Phong>> =>
    fetcher.get(`/phong-thue/${id}`).then((res) => res.data),
  uploadHinhPhong: (
    formData: FormData,
    maPhong: string | number,
    tokenBearer: string
  ) =>
    fetcher.post(`/phong-thue/upload-hinh-phong?maPhong=${maPhong}`, formData, {
      headers: { token: tokenBearer },
    }),
  editPhong: (id: number | string, phongData: Phong, tokenBearer: string) =>
    fetcher.put(`/phong-thue/${id}`, phongData, {
      headers: { token: tokenBearer },
    }),
  createPhong: (phongData: CreatePhongDto, tokenBearer: string) =>
    fetcher.post(`/phong-thue`, phongData, {
      headers: { token: tokenBearer },
    }),
};
