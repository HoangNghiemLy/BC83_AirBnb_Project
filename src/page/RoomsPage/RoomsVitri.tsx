import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { phongServices } from "../../services/phongServices";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import SelectForm from "../home-layouts/SelectForm";
import type { Phong } from "../../types/Phong";
import type { Params } from "../../types";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";

export default function RoomsVitri() {
  const { soLuongKhach } = useSelector(
    (state: RootState) => state.bookingSlice
  );
  const { id } = useParams<Params>();
  const [rooms, setRooms] = useState<Phong[]>([]);
  const navigate = useNavigate();
  const { themeMode } = useSelector((state: RootState) => state.darkModeSlice);
  const { t } = useTranslation();
  const handleRoomClick = (id: number) => {
    navigate(`/room-detail/${id}`);
  };

  const locationMapping: Record<string, string> = {
    "1": "Hồ Chí Minh",
    "2": "Cần Thơ",
    "3": "Nha Trang",
    "4": "Hà Nội",
    "5": "Phú Quốc",
    "6": "Đà Nẵng",
    "7": "Đà Lạt",
    "8": "Phan Thiết",
  };

  const renderList = () => {
    const filteredRooms = rooms.filter((room) => room.khach >= soLuongKhach);

    if (filteredRooms.length > 0) {
      return filteredRooms.map((room) => (
        <div
          data-aos="zoom-in"
          key={room.id}
          onClick={() => handleRoomClick(room.id)}
          className="md:flex grid grid-cols-1 border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white duration-300 cursor-pointer hover:shadow-lg card-boder"
        >
          <img
            src={room.hinhAnh}
            alt={room.tenPhong}
            className="md:w-48 w-full h-48 object-cover"
          />

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black">
                {room.tenPhong}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {room.khach} {t("rooms.Guests")} • {room.phongNgu}{" "}
                {t("rooms.Bedrooms")} • {room.giuong} {t("rooms.Beds")} •{" "}
                {room.phongTam} {t("rooms.Bathrooms")}
              </p>
              <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                {room.moTa}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold">
                ${room.giaTien} / {t("rooms.night")}
              </p>
              <p className="text-xs font-medium text-gray-500 text-right">
                {[
                  room.wifi && t("detailPage.amenities.wifi"),
                  room.mayGiat && t("detailPage.amenities.washingMachine"),
                  room.hoBoi && t("detailPage.amenities.pool"),
                  room.banUi && t("detailPage.amenities.steamIron"),
                  room.dieuHoa && t("detailPage.amenities.airConditioner"),
                  room.bep && t("detailPage.amenities.kitchen"),
                  room.tivi && t("detailPage.amenities.tv"),
                  room.banLa && t("detailPage.amenities.iron"),
                  room.doXe && t("detailPage.amenities.parking"),
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin tip={t("comment.loading")} size="large" />
        </div>
      );
    }
  };

  useEffect(() => {
    if (id) {
      // console.log("Checking ID:", id);
      phongServices
        .locationPhong(id)
        .then((response) => {
          setRooms(response.content);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy dữ liệu phòng:", err);
        });
    }
  }, [id]);

  return (
    <div className={`${themeMode}`}>
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1520769945061-0a448c463865?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-80"
          style={{
            backgroundImage: "linear-gradient(195deg,#4c4c4c,#191919)",
          }}
        ></div>

        <h1 className="absolute text-white text-3xl font-bold z-10">
          {id ? locationMapping[id] || "Địa điểm không xác định" : ""}
        </h1>
      </div>

      <SelectForm isRoompage={false} handleSelectRoomByLocation={() => {}} />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            {t("detailPage.titleLocal")}
          </h2>
          {renderList()}
        </div>

        <div>
          <iframe
            data-aos="zoom-in"
            title="Google Maps"
            className="w-full h-full rounded-lg shadow-lg"
            src={`https://www.google.com/maps?q=${
              id ? locationMapping[id] : "Vietnam"
            }&output=embed`}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
