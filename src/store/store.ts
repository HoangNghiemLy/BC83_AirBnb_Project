import { configureStore } from "@reduxjs/toolkit";
import type { ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import spinnerReducer from "./slices/spinnerSlice";
import darkModeReducer from "./slices/darkModeSlice";
import bookingReducer from "./slices/bookingSlice";
import userSlice from "./slices/userSlice";
import detailRoomSlice from "./slices/detailRoomSlice";
import quanLyViTriSlice from "./slices/quanLyViTriSlice";
import infoUserSlice from "./slices/infoUserSlice";
import quanLyNguoiDungReducer from "./slices/quanLyNguoiDungSlice";
import quanLyPhongSlice from "./slices/quanLyPhongSlice";
import quanLyBookingSlice from "./slices/quanLyBookingSlice";
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    counter: counterReducer,
    spinnerSlice: spinnerReducer,
    darkModeSlice: darkModeReducer,
    bookingSlice: bookingReducer,
    detailRoomSlice: detailRoomSlice,
    quanLyViTriSlice: quanLyViTriSlice,
    infoUserSlice: infoUserSlice,
    quanLyNguoiDungSlice: quanLyNguoiDungReducer,
    quanLyPhongSlice: quanLyPhongSlice,
    quanLyBookingSlice: quanLyBookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
