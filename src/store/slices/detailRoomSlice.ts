import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDetailRoomAction,
  fetchListCommentByIdRoomAction,
} from "../thunks/detailRoomThunks";
import type { Phong } from "../../types/Phong";
import type { Comment } from "../../types/Comment";
import type { DetailRoomState } from "../../types";

const initialState: DetailRoomState = {
  infoRoom: null,
  listComment: [],
};

const detailRoomSlice = createSlice({
  name: "detailRoomSlice",
  initialState,
  reducers: {
    setInfoRoomAction: (state, action: PayloadAction<Phong>) => {
      state.infoRoom = action.payload;
    },
    setListCommentAction: (state, action: PayloadAction<Comment[]>) => {
      state.listComment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDetailRoomAction.fulfilled, (state, action) => {
      state.infoRoom = action.payload;
    });
    builder.addCase(fetchDetailRoomAction.rejected, (_, action) => {
      console.error(action.error);
      window.location.href = "/";
    });

    builder.addCase(
      fetchListCommentByIdRoomAction.fulfilled,
      (state, action) => {
        state.listComment = action.payload;
      }
    );
    builder.addCase(fetchListCommentByIdRoomAction.rejected, (_, action) => {
      console.error(action.error);
    });
  },
});

export const { setInfoRoomAction, setListCommentAction } =
  detailRoomSlice.actions;

export default detailRoomSlice.reducer;
