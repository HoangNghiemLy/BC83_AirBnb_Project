import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";

import { setIsModalOpenAction } from "../../store/slices/quanLyViTriSlice";

import { fetchListViTriAction } from "../../store/thunks/quanLyViTriThunks";
import type { AppDispatch } from "../../store/store";
import ListViTri from "./ListViTri";
import ModalQLViTri from "./ModalQLViTri";
import ModalEditQLViTri from "./ModalEditQLViTri";

export default function QuanLyViTriPage() {
  const [valueInput, setValueInput] = useState<string>("");
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // debounce tính năng search
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueInput(value.trimStart());

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      dispatch(
        fetchListViTriAction({ currentPage: 1, valueInput: value.trimStart() })
      );
    }, 1000);
  };

  return (
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý vị trí</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className="button-primary "
        >
          Thêm vị trí mới
        </button>
      </div>

      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên vị trí"
        onChange={handleChangeSearch}
        value={valueInput}
      />

      {/* list vị trí */}
      <ListViTri valueInput={valueInput} />
      <ModalQLViTri valueInput={valueInput} />
      <ModalEditQLViTri valueInput={valueInput} />
    </div>
  );
}
