import { StarFilled } from "@ant-design/icons";
import { App as AntdApp } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalCalendarOpen,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
  setListIdBooking,
  setSoLuongKhach,
  setTienTruocThue,
} from "../../store/slices/bookingSlice";
import dayjs from "dayjs";
import { bookingServices } from "../../services/bookingServices";
import { setIsModalOpen, setModalContent } from "../../store/slices/userSlice";

import ModalPayment from "./ModalPayment";
import ModalReBooking from "./ModalReBooking";
import type { RootState } from "../../types/Comment";
import { useTranslation } from "react-i18next";

export default function InfoRoomRight() {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const { infoRoom, listComment } = useSelector(
    (state: RootState) => state.detailRoomSlice
  );
  const {
    listIdBooking,
    isBooked,
    soLuongKhach,
    totalDay,
    ngayDen,
    ngayDi,
    tienTruocThue,
  } = useSelector((state: RootState) => state.bookingSlice);
  const loginData = useSelector(
    (state: RootState) => state.userSlice.loginData
  );
  const user = loginData?.user;

  const dispatch = useDispatch();

  const isLogin = () => {
    if (!user) {
      dispatch(setModalContent("login"));
      dispatch(setIsModalOpen(true));
      return message.warning(t("message.warning.loginBooking"));
    }
    if (isBooked) {
      return dispatch(setIsModalReBookingOpen(true));
    }
    dispatch(setIsModalPaymentOpen(true));
  };

  const bookingAction = () => {
    if (!user) {
      message.warning(t("message.warning.loginBooking"));
      return;
    }
    const ngayDenClone = new Date(ngayDen);
    const ngayDiClone = new Date(ngayDi);

    const body = {
      maPhong: infoRoom.id,
      ngayDen: dayjs(ngayDenClone.setDate(ngayDenClone.getDate() + 1)).format(
        "YYYY-MM-DD"
      ),
      ngayDi: dayjs(ngayDiClone.setDate(ngayDiClone.getDate() + 1)).format(
        "YYYY-MM-DD"
      ),
      soLuongKhach,
      maNguoiDung: user.id,
    };
    bookingServices
      .createBooking(body)
      .then(() => {
        const listIdBookingClone = [...listIdBooking, infoRoom.id];
        localStorage.setItem(
          "LIST_ID_BOOKING",
          JSON.stringify(listIdBookingClone)
        );
        dispatch(setListIdBooking(listIdBookingClone));
        dispatch(setIsModalPaymentOpen(false));
        message.success(t("message.success.successBooking"));
        message.info(t("message.info.seeProfile"));
      })
      .catch((err: unknown) => {
        message.error(t("message.error.errorBooking"));

        // Nếu muốn log chi tiết, cần kiểm tra kiểu
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Unexpected error", err);
        }
      });
  };

  const calculateRating = (): number => {
    if (listComment.length === 0) return 0;
    const total = listComment.reduce((sum, c) => sum + c.saoBinhLuan, 0);
    return parseFloat((total / listComment.length).toFixed(2));
  };

  const handleSoKhachChange = (option: number) => {
    const totalKhach = soLuongKhach + option;

    if (totalKhach < 1) {
      dispatch(setSoLuongKhach(1));
      return message.warning(t("message.warning.guestOne"));
    }
    if (totalKhach > infoRoom.khach) {
      dispatch(setSoLuongKhach(infoRoom.khach));
      return message.warning(t("message.warning.guestMore"));
    }
    dispatch(setSoLuongKhach(totalKhach));
  };

  const tienNgay = infoRoom.giaTien * totalDay;
  useEffect(() => {
    dispatch(setTienTruocThue(tienNgay + 8));
  }, [tienNgay, dispatch]);

  return (
    <div className="basis-1/3 sticky top-0 w-full lg:h-80">
      <div className="p-5 space-y-5 divide-y-2 border border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="space-y-3">
          <div className="flex justify-between text-dark">
            <div>
              <span className="font-bold">{infoRoom.giaTien}$</span> /{" "}
              {t("rooms.night")}
            </div>
            <div className="flex gap-2">
              <p className="space-x-2">
                <StarFilled className="text-primary" />
                <span className="font-bold">{calculateRating()}</span>
              </p>
              <a className="underline text-comment" href="#">
                {listComment.length} {t("comment.button")}
              </a>
            </div>
          </div>

          {/* Lịch */}
          <div className="border-2 border-gray-300 rounded-lg">
            <div className="flex items-center justify-between border border-gray-300">
              <div
                className="p-3 cursor-pointer grow border-r-2 border-gray-300 text-dark"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <h1 className="font-bold">{t("detailPage.checkIn")}</h1>
                <p>{dayjs(ngayDen).format("DD/MM/YYYY")}</p>
              </div>
              <div
                className="p-3 cursor-pointer grow text-dark"
                onClick={() => dispatch(setIsModalCalendarOpen(true))}
              >
                <h1 className="font-bold">{t("detailPage.checkOut")}</h1>
                <p>{dayjs(ngayDi).format("DD/MM/YYYY")}</p>
              </div>
            </div>

            {/* Khách */}
            <div className="p-3 border-t-2 border-gray-300">
              <h1 className="font-bold text-center text-dark">
                {t("rooms.Guests")}
              </h1>
              <div className="flex justify-evenly items-center">
                <button
                  className="w-9 h-9 font-bold hover:opacity-80 duration-300 text-white rounded-full bg-primary flex items-center justify-center"
                  onClick={() => handleSoKhachChange(-1)}
                >
                  <div>–</div>
                </button>
                <p className="text-dark">{soLuongKhach}</p>
                <button
                  className="w-9 h-9 font-bold hover:opacity-80 duration-300 text-white rounded-full bg-primary flex items-center justify-center"
                  onClick={() => handleSoKhachChange(1)}
                >
                  <div>+</div>
                </button>
              </div>
            </div>
          </div>

          {/* Giá */}
          <div className="flex justify-between text-dark">
            <p className="font-bold">
              ${infoRoom.giaTien} X {totalDay} {t("rooms.night")}
            </p>
            <p className="font-bold">$ {tienNgay}</p>
          </div>
          <div className="flex justify-between text-dark border-dark">
            <p className="font-bold">{t("detailPage.cleaning")}</p>
            <p className="font-bold">$ 8</p>
          </div>
        </div>

        <div className="space-y-5 py-3">
          <div className="flex justify-between text-dark">
            <p className="font-bold">{t("detailPage.total")}</p>
            <p className="font-bold">$ {tienTruocThue}</p>
          </div>
          <div>
            <button
              className="button-primary w-full font-bold"
              style={{ padding: "12px 0px" }}
              onClick={isLogin}
            >
              {t("detailPage.booking")}
            </button>
          </div>
          <div>
            <p
              className="text-primary underline hover:cursor-pointer"
              onClick={() => (window.location.href = "/info-user")}
            >
              {t("detailPage.titleProfile")}
            </p>
          </div>
        </div>
      </div>
      <ModalPayment bookingAction={bookingAction} />
      <ModalReBooking />
    </div>
  );
}
