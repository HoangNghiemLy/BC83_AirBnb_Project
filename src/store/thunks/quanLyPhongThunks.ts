import { createAsyncThunk } from "@reduxjs/toolkit";
import { phongServices } from "../../services/phongServices";
import type {
  Phong,
  ApiResponse,
  InfoRoom,
  PhongResponse,
} from "../../types/Phong";

interface FetchListPhongParams {
  currentPage: number;
  valueInput: string;
  pageSize?: number;
}
type FindPhongResponse = ApiResponse<{
  data: Phong[];
  totalRow: number;
}>;
export const fetchListPhongAction = createAsyncThunk<
  PhongResponse,
  FetchListPhongParams
>(
  "quanLyPhongSlice/fetchListPhongAction",
  async ({ currentPage, valueInput, pageSize = 10 }) => {
    const response = await phongServices.findPhongAdmin(
      currentPage,
      pageSize,
      valueInput
    );

    const result: FindPhongResponse = response.data;

    return {
      data: result.content.data,
      totalRow: result.content.totalRow ?? 0,
      pageIndex: currentPage,
    };
  }
);

export const fetchPhongInfoAction = createAsyncThunk<InfoRoom, string>(
  "quanLyPhongSlice/fetchPhongInfoAction",
  async (id: string | number) => {
    const result = await phongServices.getPhongInfo(id);
    return result.content;
  }
);
