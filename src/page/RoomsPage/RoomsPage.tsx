import { useEffect, useState } from "react";
import { phongServices } from "../../services/phongServices";
import { useNavigate } from "react-router-dom";
import { App as AntdApp, Pagination } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Phong } from "../../types/Phong";
import SelectForm from "../home-layouts/SelectForm";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 12;

export default function RoomsPage() {
  const { message } = AntdApp.useApp();
  const [phongArr, setPhongArr] = useState<Phong[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const soLuongKhach = useSelector(
    (state: RootState) => state.bookingSlice.soLuongKhach
  );
  const themeMode = useSelector(
    (state: RootState) => state.darkModeSlice.themeMode
  );

  useEffect(() => {
    phongServices
      .getListPhong()
      .then((res) => {
        if (res.content.length > 0) {
          setPhongArr(res.content);
        } else {
          message.error(t("message.error.notData"));
        }
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, [message, t]);

  const handleRoomClick = (id: number) => {
    navigate(`/room-detail/${id}`);
  };

  const handleSelectRoomByLocation = async (id: number | null) => {
    if (id === null) return;
    try {
      const result = await phongServices.locationPhong(id);
      setPhongArr(result.content);
      setCurrentPage(1); // Reset về trang đầu khi lọc dữ liệu
    } catch (error) {
      console.error("Lỗi khi lọc phòng theo vị trí:", error);
    }
  };

  // Cắt dữ liệu theo trang
  const getPaginatedRooms = () => {
    const filtered = phongArr.filter((phong) => phong.khach >= soLuongKhach);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const filteredRooms = phongArr.filter((phong) => phong.khach >= soLuongKhach);

  const renderList = () => {
    const paginatedRooms = getPaginatedRooms();

    if (paginatedRooms.length > 0) {
      return paginatedRooms.map((phong) => (
        <div
          data-aos="zoom-in"
          key={phong.id}
          onClick={() => handleRoomClick(phong.id)}
          className="bg-shadow bg-white rounded-lg shadow-lg overflow-hidden flex flex-col duration-300 cursor-pointer hover:shadow-2xl"
        >
          <div className="relative">
            <img
              src={phong.hinhAnh || "https://via.placeholder.com/300"}
              alt={phong.tenPhong}
              className="w-full h-52 object-cover"
            />
            <span className="absolute top-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded-lg shadow-md">
              {t("rooms.favourite")}
            </span>
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow">
            <h3 className="font-semibold text-lg truncate text-black">
              {phong.tenPhong}
            </h3>
            <p className="text-black text-base font-semibold mt-3">
              ${phong.giaTien} / {t("rooms.night")}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {phong.khach} {t("rooms.Guests")} - {phong.phongNgu} {""}
              {t("rooms.Bedrooms")} - {phong.giuong} {t("rooms.Beds")} -
              {phong.phongTam} {t("rooms.Bathrooms")}
            </p>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="flex flex-col justify-center items-center min-h-[300px] w-full text-center">
          <p className="text-gray-600 text-lg">{t("rooms.notRoom")}</p>
        </div>
      );
    }
  };

  return (
    <div className={`${themeMode}`}>
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/10/canh-dep-thumnail.jpg)",
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
      </div>

      <SelectForm
        isRoompage={true}
        handleSelectRoomByLocation={handleSelectRoomByLocation}
      />

      <div className="container">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6"> {t("rooms.listRoom")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderList()}
          </div>

          {/* Pagination */}
          {filteredRooms.length > PAGE_SIZE && (
            <div className="flex justify-center mt-10">
              <div className="bg-white rounded-lg shadow-md px-6 py-4">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredRooms.length}
                  onChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when page changes
                  }}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
