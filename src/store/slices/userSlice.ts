import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserSlice, UserState } from "../../types/User";

// Lấy dữ liệu user từ localStorage nếu có
const loginJson = localStorage.getItem("USER_LOGIN");
const initialState: UserState = {
  loginData: loginJson ? JSON.parse(loginJson) : null,
  isModalOpen: false,
  modalContent: "login",
};

// Slice
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<UserSlice | null>) => {
      state.loginData = action.payload;
    },

    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setModalContent: (state, action: PayloadAction<"login" | "register">) => {
      state.modalContent = action.payload;
    },
  },
});

// Export actions & reducer
export const { setLoginData, setIsModalOpen, setModalContent } =
  userSlice.actions;
export default userSlice.reducer;
