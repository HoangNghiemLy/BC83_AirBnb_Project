import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingServices } from "../../services/bookingServices";
import { phongServices } from "../../services/phongServices";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import type { User } from "../../types/User";
import type { Booking } from "../../types/Booking";
import type { Phong } from "../../types/Phong";

// Action 1: Lấy thông tin người dùng
export const fetchInfoUserAction = createAsyncThunk<User, number>(
  "infoUserSlice/fetchInfoUserAction",
  async (id: number) => {
    const result = await nguoiDungServices.getUserInfo(id);
    return result.data.content;
  }
);

// Action 2: Tạo danh sách ID phòng đã đặt
export const createListIdBookingAction = createAsyncThunk<
  { listId: number[]; listBooked: Booking[] },
  number
>("infoUserSlice/createListIdBooking", async (idUser: number) => {
  const listIdBookingClone: number[] = [];
  const result = await bookingServices.searchBooking(idUser);
  const bookingArr: Booking[] = result.data.content;

  for (let i = 0; i < bookingArr.length; i++) {
    listIdBookingClone.push(bookingArr[i].maPhong);
  }

  return {
    listId: listIdBookingClone,
    listBooked: bookingArr,
  };
});

// Action 3: Tạo danh sách phòng đã đặt từ listId
export const createListBookedRoomAction = createAsyncThunk<Phong[], number[]>(
  "infoUserSlice/createListBookedRoom",
  async (listId: number[]) => {
    const listBookedRoomClone: Phong[] = [];
    const result = await phongServices.getListPhong();
    console.log("Check list phong: ", result);
    const listPhong: Phong[] = result.content;

    listId.forEach((id) => {
      const phong = listPhong.find((p) => p.id === id);
      if (phong) {
        listBookedRoomClone.push(phong);
      }
    });

    return listBookedRoomClone;
  }
);
