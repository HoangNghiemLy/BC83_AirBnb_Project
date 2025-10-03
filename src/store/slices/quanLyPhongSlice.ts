import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../thunks/quanLyPhongThunks";
import type { Phong, InfoRoom } from "../../types/Phong";

interface QuanLyPhongState {
  listPhong: Phong[];
  phongInfo: InfoRoom | null;
  isModalOpen: boolean;
  isModalEditOpen: boolean;
  totalRow: number | null;
  currentPage: number;
}

const initialState: QuanLyPhongState = {
  listPhong: [],
  phongInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

const quanLyPhongSlice = createSlice({
  name: "quanLyPhongSlice",
  initialState,
  reducers: {
    setListPhongAction: (state, action: PayloadAction<Phong[]>) => {
      state.listPhong = action.payload;
    },
    setIsModalOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setIsModalEditOpenAction: (state, action: PayloadAction<boolean>) => {
      state.isModalEditOpen = action.payload;
    },
    setTotalRowAction: (state, action: PayloadAction<number>) => {
      state.totalRow = action.payload;
    },
    setCurrentPageAction: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListPhongAction.fulfilled, (state, action) => {
      state.listPhong = action.payload.data;
      state.totalRow = action.payload.totalRow;
      state.currentPage = action.payload.pageIndex;
    });
    builder.addCase(fetchListPhongAction.rejected, (_, action) => {
      console.error(action.error);
    });
    builder.addCase(fetchPhongInfoAction.fulfilled, (state, action) => {
      state.phongInfo = action.payload;
    });
    builder.addCase(fetchPhongInfoAction.rejected, (_, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListPhongAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyPhongSlice.actions;

export default quanLyPhongSlice.reducer;
