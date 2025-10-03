import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingServices } from "../../services/bookingServices";
import type { Booking } from "../../types/Booking"; // đảm bảo đã có interface Booking
import type { AxiosResponse } from "axios";

// Lấy danh sách booking
export const fetchListBookingAction = createAsyncThunk<Booking[]>(
  "quanLyBookingSlice/fetchListBookingAction",
  async () => {
    const result: AxiosResponse<{ content: Booking[] }> =
      await bookingServices.getListBooking();
    return result.data.content;
  }
);

// Lấy thông tin chi tiết 1 booking
export const fetchBookingInfoAction = createAsyncThunk<Booking, string>(
  "quanLyBookingSlice/fetchBookingInfoAction",
  async (bookingId: string) => {
    const result: AxiosResponse<{ content: Booking }> =
      await bookingServices.getBookingInfo(bookingId);
    return result.data.content;
  }
);
