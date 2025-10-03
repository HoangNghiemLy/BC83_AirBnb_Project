import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
import {
  getListIdBookingAction,
  checkIsBookedAction,
} from "../thunks/bookingThunks";
import type { BookingState } from "../../types/Booking";

const listIdBookingJson: string | null =
  localStorage.getItem("LIST_ID_BOOKING");

const initialState: BookingState = {
  listIdBooking: listIdBookingJson ? JSON.parse(listIdBookingJson) : [],
  isBooked: false,
  totalDay: 7,
  ngayDen: new Date().toISOString(),
  ngayDi: addDays(new Date(), 7).toISOString(),
  soLuongKhach: 1,
  tienTruocThue: null,
  isModalCalendarOpen: false,
  isModalPaymentOpen: false,
  isModalReBookingOpen: false,
};

const bookingSlice = createSlice({
  name: "bookingSlice",
  initialState,
  reducers: {
    setListIdBooking: (state, action: PayloadAction<number[] | null>) => {
      state.listIdBooking = action.payload;
    },
    setIsBooked: (state, action: PayloadAction<boolean>) => {
      state.isBooked = action.payload;
    },
    setIsModalCalendarOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalCalendarOpen = action.payload;
    },
    setTotalDay: (state, action: PayloadAction<number>) => {
      state.totalDay = action.payload;
    },
    setTienTruocThue: (state, action: PayloadAction<number | null>) => {
      state.tienTruocThue = action.payload;
    },
    setSoLuongKhach: (state, action: PayloadAction<number>) => {
      state.soLuongKhach = action.payload;
    },
    setNgayDen: (state, action: PayloadAction<string>) => {
      state.ngayDen = action.payload;
    },
    setNgayDi: (state, action: PayloadAction<string>) => {
      state.ngayDi = action.payload;
    },
    setIsModalPaymentOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalPaymentOpen = action.payload;
    },
    setIsModalReBookingOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalReBookingOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getListIdBookingAction.fulfilled,
      (state, action: PayloadAction<number[]>) => {
        state.listIdBooking = action.payload;
      }
    );
    builder.addCase(getListIdBookingAction.rejected, (_, action) => {
      console.error(action.error);
    });
    builder.addCase(
      checkIsBookedAction.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.isBooked = action.payload;
      }
    );
    builder.addCase(checkIsBookedAction.rejected, (_, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListIdBooking,
  setIsBooked,
  setIsModalCalendarOpen,
  setTotalDay,
  setTienTruocThue,
  setSoLuongKhach,
  setNgayDen,
  setNgayDi,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} = bookingSlice.actions;

export default bookingSlice.reducer;
