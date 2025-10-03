import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchListBookingAction,
  fetchBookingInfoAction,
} from "../thunks/quanLyBookingThunks";
import type { Booking } from "../../types/Booking";

interface QuanLyBookingState {
  listBooking: Booking[];
  bookingInfo: Booking | null;
  isModalEditOpen: boolean;
}

const initialState: QuanLyBookingState = {
  listBooking: [],
  bookingInfo: null,
  isModalEditOpen: false,
};

const quanLyBookingSlice = createSlice({
  name: "quanLyBookingSlice",
  initialState,
  reducers: {
    setListBookingAction: (state, action: PayloadAction<Booking[]>) => {
      state.listBooking = action.payload;
    },
    setIsModalEditOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalEditOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchListBookingAction
      .addCase(fetchListBookingAction.fulfilled, (state, action) => {
        state.listBooking = action.payload;
      })
      .addCase(fetchListBookingAction.rejected, (_, action) => {
        console.error(action.error);
      })

      // fetchBookingInfoAction
      .addCase(fetchBookingInfoAction.fulfilled, (state, action) => {
        state.bookingInfo = action.payload;
      })
      .addCase(fetchBookingInfoAction.rejected, (_, action) => {
        console.error(action.error);
      });
  },
});

export const { setListBookingAction, setIsModalEditOpenAction } =
  quanLyBookingSlice.actions;
export default quanLyBookingSlice.reducer;
