import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import ListUser from "./ListUser";

import { useDispatch } from "react-redux";
import { setIsModalOpenAction } from "../../store/slices/quanLyNguoiDungSlice";
import { fetchListUserAction } from "../../store/thunks/quanLyNguoiDungThunks";
import type { AppDispatch } from "../../store/store";
import ModalQLNguoiDung from "./ModalQLNguoiDung";
import ModalEditQLNguoiDung from "./ModalEditQLNguoiDung";
import type { ReactElement } from "react";
export default function QuanLyNguoiDungPage(): ReactElement {
  const [valueInput, setValueInput] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  // const searchRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce tính năng search
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const trimmedValue = value.trimStart();
    setValueInput(trimmedValue);

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      dispatch(
        fetchListUserAction({ currentPage: 1, valueInput: trimmedValue })
      );
    }, 1000);
  };

  return (
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý User</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className="button-primary"
        >
          Thêm người dùng mới
        </button>
      </div>

      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên người dùng"
        onChange={handleChangeSearch}
        value={valueInput}
      />

      {/* list user */}
      <ListUser valueInput={valueInput} />

      {/* modal add */}
      <ModalQLNguoiDung valueInput={valueInput} />

      {/* modal edit */}
      <ModalEditQLNguoiDung valueInput={valueInput} />
    </div>
  );
}
