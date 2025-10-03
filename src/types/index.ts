import type { ReactNode } from "react";
import type { Phong } from "./Phong";
import type { Comment } from "./Comment";
export interface HomeLayoutProps {
  children: ReactNode;
}
export interface CardItem {
  id: number;
  title: string;
  image: string;
}
export interface LocationItem {
  id: number;
  hinhAnh: string;
  tinhThanh: string;
}

export interface SelectFormProps {
  isRoompage: boolean;
  handleSelectRoomByLocation: (id: number | null) => void;
}
export interface Params {
  id?: string;
  [key: string]: string | undefined;
}
export interface TempFormLoginProps {
  onLoginSuccess?: () => void;
}
export interface CounterState {
  value: number;
}
export interface DarkModeState {
  themeMode: "light" | "dark";
}
export interface DetailRoomState {
  infoRoom: Phong | null;
  listComment: Comment[];
}
export interface SpinnerState {
  isLoading: boolean;
}
