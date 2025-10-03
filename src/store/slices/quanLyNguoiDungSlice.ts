import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../thunks/quanLyNguoiDungThunks";
import type { User } from "../../types/User";

interface QuanLyNguoiDungState {
  listUser: User[];
  userInfo: User | null;
  isModalOpen: boolean;
  isModalEditOpen: boolean;
  totalRow: number | null;
  currentPage: number;
}

// ==== Initial state ====
const initialState: QuanLyNguoiDungState = {
  listUser: [],
  userInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

// ==== Slice ====
const quanLyNguoiDungSlice = createSlice({
  name: "quanLyNguoiDungSlice",
  initialState,
  reducers: {
    setListUserAction: (state, action: PayloadAction<User[]>) => {
      state.listUser = action.payload;
    },
    setIsModalOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setIsModalEditOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalEditOpen = action.payload;
    },
    setTotalRowAction: (state, action: PayloadAction<number | null>) => {
      state.totalRow = action.payload;
    },
    setCurrentPageAction: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListUserAction.fulfilled, (state, action) => {
      state.listUser = action.payload.data;
      state.totalRow = action.payload.totalRow;
      state.currentPage = action.payload.pageIndex;
    });
    builder.addCase(fetchListUserAction.rejected, (_, action) => {
      console.error(action.error);
    });

    builder.addCase(fetchUserInfoAction.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
    builder.addCase(fetchUserInfoAction.rejected, (_, action) => {
      console.error(action.error);
    });
  },
});

// ==== Exports ====
export const {
  setListUserAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyNguoiDungSlice.actions;

export default quanLyNguoiDungSlice.reducer;
