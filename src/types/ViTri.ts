// Interface cho một vị trí
export interface ViTri {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}
export type CreateViTriDto = Omit<ViTri, "id">;
// Interface cho dữ liệu trả về chung từ API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
}

// Interface cho dữ liệu phân trang
export interface PaginatedViTri {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  data: ViTri[];
}
export interface QuanLyViTriState {
  listViTri: ViTri[];
  viTriInfo: ViTri | null;
  isModalOpen: boolean;
  isModalEditOpen: boolean;
  totalRow: number | null;
  currentPage: number;
}
