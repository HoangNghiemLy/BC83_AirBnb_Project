import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createListBookedRoomAction,
  createListIdBookingAction,
  fetchInfoUserAction,
} from "../thunks/infoUserThunks";
import type { InfoUserState, User } from "../../types/User";
import type { Booking } from "../../types/Booking";
import type { Phong } from "../../types/Phong";

// Initial state
const initialState: InfoUserState = {
  infoUser: {},
  listBooked: [],
  listIdBooking: [],
  listBookedRoom: [],
  isModalUpHinhOpen: false,
  isModalEditOpen: false,
};

const infoUserSlice = createSlice({
  name: "infoUserSlice",
  initialState,
  reducers: {
    setInfoUserAction: (state, action: PayloadAction<User>) => {
      state.infoUser = action.payload;
    },
    setListBookedAction: (state, action: PayloadAction<Booking[]>) => {
      state.listBooked = action.payload;
    },
    setListIDBookingAction: (state, action: PayloadAction<number[]>) => {
      state.listIdBooking = action.payload;
    },
    setListBookedRoomAction: (state, action: PayloadAction<Phong[]>) => {
      state.listBookedRoom = action.payload;
    },
    setIsModalUpHinhOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalUpHinhOpen = action.payload;
    },
    setIsModalEditOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalEditOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchInfoUserAction
    builder.addCase(fetchInfoUserAction.fulfilled, (state, action) => {
      state.infoUser = action.payload;
    });
    builder.addCase(fetchInfoUserAction.rejected, (_, action) => {
      console.error(action.error);
    });

    // createListIdBookingAction
    builder.addCase(createListIdBookingAction.fulfilled, (state, action) => {
      state.listIdBooking = action.payload.listId;
      state.listBooked = action.payload.listBooked;
    });
    builder.addCase(createListIdBookingAction.rejected, (_, action) => {
      console.error(action.error);
    });

    // createListBookedRoomAction
    builder.addCase(createListBookedRoomAction.fulfilled, (state, action) => {
      state.listBookedRoom = action.payload;
    });
    builder.addCase(createListBookedRoomAction.rejected, (_, action) => {
      console.error(action.error);
    });
  },
});

// Export actions
export const {
  setInfoUserAction,
  setListBookedAction,
  setListIDBookingAction,
  setListBookedRoomAction,
  setIsModalUpHinhOpenAction,
  setIsModalEditOpenAction,
} = infoUserSlice.actions;

// Export reducer
export default infoUserSlice.reducer;
