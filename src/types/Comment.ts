import type { User } from "./User";

export interface Comment {
  id: number;
  avatar?: string;
  tenNguoiBinhLuan: string;
  saoBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
}
export interface CommentForm {
  maPhong: string;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}
export interface CommentProps {
  idRoom: string;
}

export interface CommentItem {
  id: number;
  avatar?: string;
  tenNguoiBinhLuan: string;
  saoBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
}

export interface CommentFormValues {
  saoBinhLuan: number;
  noiDung: string;
}
export interface CommentStart {
  saoBinhLuan: number;
}
export interface InfoRoom {
  id: number;
  khach: number;
  giaTien: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
}

export interface RootState {
  detailRoomSlice: {
    infoRoom: InfoRoom;
    listComment: CommentStart[];
  };
  bookingSlice: {
    listIdBooking: number[];
    isBooked: boolean;
    soLuongKhach: number;
    totalDay: number;
    ngayDen: Date;
    ngayDi: Date;
    tienTruocThue: number;
  };
  userSlice: {
    loginData: {
      user: User | null;
    };
  };
}
