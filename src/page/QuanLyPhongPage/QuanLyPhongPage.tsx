import { useRef, useState, type ChangeEvent } from "react";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store"; // Đảm bảo đường dẫn đúng
import ListPhong from "./ListPhong";
import { fetchListPhongAction } from "../../store/thunks/quanLyPhongThunks";
import { setIsModalOpenAction } from "../../store/slices/quanLyPhongSlice";
import ModalQLPhong from "./ModalQLPhong";
import ModalEditQLPhong from "./ModalEditQLPhong";

export default function QuanLyPhongPage() {
  const [valueInput, setValueInput] = useState<string>("");
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // debounce tính năng search
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValueInput(value.trimStart());

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      dispatch(
        fetchListPhongAction({ currentPage: 1, valueInput: value.trimStart() })
      );
    }, 1000);
  };

  return (
    <div>
      <div className="md:flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý phòng</h1>
        <button
          onClick={() => dispatch(setIsModalOpenAction(true))}
          className="button-primary"
        >
          Thêm phòng mới
        </button>
      </div>

      <Input
        className="p-2.5 my-3"
        placeholder="Tìm tên phòng"
        onChange={handleChangeSearch}
        value={valueInput}
      />

      <ListPhong valueInput={valueInput} />
      <ModalQLPhong valueInput={valueInput} />
      <ModalEditQLPhong valueInput={valueInput} />
    </div>
  );
}
