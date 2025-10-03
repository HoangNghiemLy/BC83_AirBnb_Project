import { createAsyncThunk } from "@reduxjs/toolkit";
import { viTriServices } from "../../services/viTriServices";
import type { PaginatedViTri, ViTri } from "../../types/ViTri";

interface FetchListViTriParams {
  currentPage: number;
  valueInput: string;
  pageSize?: number;
}

export const fetchListViTriAction = createAsyncThunk<
  PaginatedViTri,
  FetchListViTriParams
>(
  "quanLyViTriSlice/fetchListViTriAction",
  async ({ currentPage, valueInput, pageSize = 3 }) => {
    const result = await viTriServices.findViTri2(
      currentPage,
      pageSize,
      valueInput
    );
    return result.content;
  }
);

// Action: Lấy thông tin chi tiết của 1 vị trí
export const fetchViTriInfoAction = createAsyncThunk<ViTri, number>(
  "quanLyViTriSlice/fetchViTriInfoAction",
  async (id: number) => {
    const result = await viTriServices.getViTriInfo(id);
    return result.content;
  }
);
