import fetcher from "../api/fetcher";
import type { CommentForm } from "../types/Comment";

export const binhLuanServices = {
  getListComment: () => fetcher.get(`/binh-luan`).then((res) => res.data),

  getListCommentByIdRoom: (maPhong: string) =>
    fetcher
      .get(`/binh-luan/lay-binh-luan-theo-phong/${maPhong}`)
      .then((res) => res.data),

  addComment: (form: CommentForm) => {
    const loginData = JSON.parse(localStorage.getItem("USER_LOGIN") || "{}");
    const token = loginData?.token || "";

    return fetcher.post(`/binh-luan`, form, {
      headers: {
        token,
      },
    });
  },
};
