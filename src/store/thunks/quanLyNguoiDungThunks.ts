import { createAsyncThunk } from "@reduxjs/toolkit";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import type { PaginatedUserContent, User } from "../../types/User";

export interface FetchListUserParams {
  currentPage: number;
  valueInput: string;
  pageSize?: number;
}

export interface FetchListUserResponse {
  data: User[];
  totalRow: number;
  pageIndex: number;
}

// ==== Thunks ====

export const fetchListUserAction = createAsyncThunk<
  PaginatedUserContent,
  FetchListUserParams
>(
  "quanLyNguoiDungSlice/fetchListUserAction",
  async ({ currentPage, valueInput, pageSize = 10 }) => {
    const response = await nguoiDungServices.findUser(
      currentPage,
      pageSize, // 👈 dùng giá trị truyền vào thay vì fix cứng
      valueInput
    );
    return response.data.content;
  }
);

export const fetchUserInfoAction = createAsyncThunk<User, number>(
  "quanLyNguoiDungSlice/fetchUserInfoAction",
  async (userId) => {
    const response = await nguoiDungServices.getUserInfo(userId);
    return response.data.content;
  }
);
