// slices/quanLyViTriSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../thunks/quanLyViTriThunks";
import type {
  ViTri,
  PaginatedViTri,
  QuanLyViTriState,
} from "../../types/ViTri";

// Định nghĩa kiểu cho state

const initialState: QuanLyViTriState = {
  listViTri: [],
  viTriInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

const quanLyViTriSlice = createSlice({
  name: "quanLyViTriSlice",
  initialState,
  reducers: {
    setListViTriAction: (state, action: PayloadAction<ViTri[]>) => {
      state.listViTri = action.payload;
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
    // fetchListViTriAction
    builder.addCase(
      fetchListViTriAction.fulfilled,
      (state, action: PayloadAction<PaginatedViTri>) => {
        state.listViTri = action.payload.data;
        state.totalRow = action.payload.totalRow;
        state.currentPage = action.payload.pageIndex;
      }
    );
    builder.addCase(fetchListViTriAction.rejected, (_, action) => {
      console.error("Fetch danh sách vị trí thất bại:", action.error);
    });

    // fetchViTriInfoAction
    builder.addCase(
      fetchViTriInfoAction.fulfilled,
      (state, action: PayloadAction<ViTri>) => {
        state.viTriInfo = action.payload;
      }
    );
    builder.addCase(fetchViTriInfoAction.rejected, (_, action) => {
      console.error("Fetch chi tiết vị trí thất bại:", action.error);
    });
  },
});

export const {
  setListViTriAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyViTriSlice.actions;

export default quanLyViTriSlice.reducer;
