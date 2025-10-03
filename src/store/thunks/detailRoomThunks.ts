import { createAsyncThunk } from "@reduxjs/toolkit";
import { phongServices } from "../../services/phongServices";
import { binhLuanServices } from "../../services/binhLuanServices";

export const fetchDetailRoomAction = createAsyncThunk(
  "detailRoomSlice/fetchDetailRoomAction",
  async (id: string) => {
    const result = await phongServices.getPhongInfo(id);
    return result.content;
  }
);

export const fetchListCommentByIdRoomAction = createAsyncThunk(
  "detailRoomSlice/fetchListCommentAction",
  async (id: string) => {
    const result = await binhLuanServices.getListCommentByIdRoom(id);
    return result.content;
  }
);
