export interface Phong {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  totalRow?: number;
  pageIndex?: number;
}

// Kiểu dữ liệu cho bình luận
export interface Comment {
  saoBinhLuan: number;
}

// Kiểu dữ liệu cho thông tin phòng
export interface CreatePhongDto {
  tenPhong: string;
  maViTri: number;
  phongNgu: number;
  phongTam: number;
  moTa: string;
  khach: number;
  giuong: number;
  giaTien: number;
  mayGiat?: boolean;
  banLa?: boolean;
  tivi?: boolean;
  dieuHoa?: boolean;
  wifi?: boolean;
  bep?: boolean;
  doXe?: boolean;
  hoBoi?: boolean;
  banUi?: boolean;
  hinhAnh?: string;
}
export interface InfoRoom {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  hinhAnh?: string;
  giaTien?: number;
  mayGiat?: boolean;
  banLa?: boolean;
  tivi?: boolean;
  dieuHoa?: boolean;
  wifi?: boolean;
  bep?: boolean;
  doXe?: boolean;
  hoBoi?: boolean;
  banUi?: boolean;
  maViTri?: number | string;
}

export interface PhongResponse {
  data: Phong[];
  totalRow: number;
  pageIndex: number;
}
// Kiểu dữ liệu của state Redux
export interface RootState {
  detailRoomSlice: {
    infoRoom: Phong | null; // hoặc undefined nếu ban đầu không có
    listComment: Comment[];
  };
  bookingSlice: {
    listIdBooking: number[];
  };
  darkModeSlice: {
    themeMode: string;
  };
}
