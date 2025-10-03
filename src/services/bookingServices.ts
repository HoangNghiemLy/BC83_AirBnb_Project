import fetcher from "../api/fetcher";
import type { AxiosResponse } from "axios";
import type { Booking, ApiResponse, BookingPayload } from "../types/Booking";

export const bookingServices = {
  getListBooking: (): Promise<AxiosResponse<ApiResponse<Booking[]>>> =>
    fetcher.get(`/dat-phong`),

  searchBooking: (
    maNguoiDung: number | string
  ): Promise<AxiosResponse<ApiResponse<Booking[]>>> =>
    fetcher.get(`/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`),

  deleteBooking: (
    id: number | string
  ): Promise<AxiosResponse<ApiResponse<null>>> =>
    fetcher.delete(`/dat-phong/${id}`),

  getBookingInfo: (
    id: number | string
  ): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    fetcher.get(`/dat-phong/${id}`),

  createBooking: (
    booking: Booking
  ): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    fetcher.post(`/dat-phong`, booking),

  editBooking: (
    id: number,
    bookingInfo: BookingPayload
  ): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    fetcher.put(`/dat-phong/${id}`, bookingInfo),
};
