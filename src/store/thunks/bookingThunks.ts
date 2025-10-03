import { createAsyncThunk } from "@reduxjs/toolkit";

import type { Booking, CheckIsBookedParams } from "../../types/Booking";
import { bookingServices } from "../../services/bookingServices";

type GetListIdBookingParams = string | number;
type ListIdBookingResult = number[];

export const getListIdBookingAction = createAsyncThunk<
  ListIdBookingResult,
  GetListIdBookingParams
>("bookingSlice/getListIdBookingAction", async (idUser) => {
  const result = await bookingServices.searchBooking(idUser);
  const bookingData: Booking[] = result.data.content;

  const listIdBookingClone = bookingData.map((item) => item.maPhong);
  localStorage.setItem("LIST_ID_BOOKING", JSON.stringify(listIdBookingClone));

  return listIdBookingClone;
});

export const checkIsBookedAction = createAsyncThunk<
  boolean,
  CheckIsBookedParams
>("bookingSlice/checkIsBookedAction", async ({ listIdBooking, idRoom }) => {
  return listIdBooking.includes(idRoom);
});
