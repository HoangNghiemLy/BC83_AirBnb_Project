import { useRef, useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Input } from "antd";

import ModalEditQLBooking from "./ModalEditQLBooking";

import { setListBookingAction } from "../../store/slices/quanLyBookingSlice";
import { bookingServices } from "../../services/bookingServices";
import type { AppDispatch } from "../../store/store"; // Điều chỉnh nếu tên store khác
import type { Booking } from "../../types/Booking"; // Điều chỉnh theo tên type thực tế
import ListBooking from "./ListBooking";
import { fetchListBookingAction } from "../../store/thunks/quanLyBookingThunks";

export default function QuanLyBookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [valueInput, setValueInput] = useState<string>("");
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const trimmedValue = value.trimStart();
    setValueInput(trimmedValue);

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      fetchSearchBooking(trimmedValue);
    }, 1000);
  };

  const fetchSearchBooking = (keyword: string) => {
    if (keyword === "") {
      dispatch(fetchListBookingAction());
    } else {
      bookingServices
        .searchBooking(keyword)
        .then((result) => {
          dispatch(setListBookingAction(result.data.content as Booking[]));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div>
      <div className="flex justify-around py-5">
        <h1 className="text-2xl font-bold">Quản lý Booking</h1>
      </div>
      {/* input search */}
      <Input
        className="p-2.5 my-3"
        placeholder="Nhập mã người dùng..."
        onChange={handleChangeSearch}
        value={valueInput}
      />
      {/* list booking */}
      <ListBooking
        fetchSearchBooking={fetchSearchBooking}
        valueInput={valueInput}
      />
      {/* modal edit */}
      <ModalEditQLBooking
        fetchSearchBooking={fetchSearchBooking}
        valueInput={valueInput}
      />
    </div>
  );
}
