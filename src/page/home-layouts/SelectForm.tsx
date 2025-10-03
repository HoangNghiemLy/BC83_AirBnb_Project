import React, { useState, useEffect } from "react";
import { App as AntdApp, Button, Popover } from "antd";
import { SearchOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "dayjs/locale/en";
import { viTriServices } from "../../services/viTriServices";
import {
  setNgayDen,
  setNgayDi,
  setSoLuongKhach,
  setTotalDay,
} from "../../store/slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { vi } from "date-fns/locale";
import { addDays } from "date-fns";
import type { RootState, AppDispatch } from "../../store/store";
import { useTranslation } from "react-i18next";
import type { LocationItem, SelectFormProps } from "../../types";

const SelectForm: React.FC<SelectFormProps> = ({
  isRoompage,
  handleSelectRoomByLocation,
}) => {
  const { message } = AntdApp.useApp();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [openLocation, setOpenLocation] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { themeMode } = useSelector((state: RootState) => state.darkModeSlice);
  const { ngayDen, ngayDi, soLuongKhach } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(ngayDen),
      endDate: new Date(ngayDi),
      key: "selection",
    },
  ]);
  useEffect(() => {
    dayjs.locale(i18n.language);
    setDateRange((prev) => [...prev]);
  }, [i18n.language]);

  useEffect(() => {
    viTriServices
      .findViTri("", 1, 8)
      .then((res) => {
        if (res.data.content.data.length > 0) {
          const filteredData = (res.data.content.data as LocationItem[]).map(
            (item) => ({
              id: item.id,
              hinhAnh: item.hinhAnh,
              tinhThanh: item.tinhThanh,
            })
          );
          setLocations(filteredData);
        }
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);

  // const handleDateChange = (ranges: RangeKeyDict) => {
  //   const selectedRange = ranges["selection"];
  //   if (selectedRange.startDate && selectedRange.endDate) {
  //     setDateRange([selectedRange]);
  //     dispatch(setNgayDen(new Date().toISOString()));
  //     dispatch(setNgayDi(addDays(new Date(), 7).toISOString()));
  //     const days = Math.round(
  //       (selectedRange.endDate.getTime() - selectedRange.startDate.getTime()) /
  //         (1000 * 3600 * 24)
  //     );
  //     dispatch(setTotalDay(days));
  //   }
  // };
  const handleDateChange = (ranges: RangeKeyDict) => {
    const selectedRange = ranges["selection"];
    if (selectedRange.startDate && selectedRange.endDate) {
      setDateRange([selectedRange]);
      dispatch(setNgayDen(selectedRange.startDate.toISOString()));
      dispatch(setNgayDi(selectedRange.endDate.toISOString()));
      const days = Math.round(
        (selectedRange.endDate.getTime() - selectedRange.startDate.getTime()) /
          (1000 * 3600 * 24)
      );
      dispatch(setTotalDay(days));
    }
  };

  const handleSearch = () => {
    if (selectedLocationId === null) {
      if (window.location.pathname === "/") {
        navigate("/rooms");
        return;
      }

      if (window.location.pathname.startsWith("/rooms")) {
        message.warning(t("message.warning.chooseLocale"));

        return;
      }
    }

    navigate(`/rooms/${selectedLocationId}`);
  };

  const handleSelectLocation = (id: number | null) => {
    setSelectedLocationId(id);
    setOpenLocation(false);
    if (isRoompage) {
      handleSelectRoomByLocation(id);
    }
    // console.log("Đã chọn địa điểm:", id);
  };

  const locationContent = (
    <div className="p-4">
      <p className="font-bold text-lg mb-2">
        {t("homepage.SelectForm.find_location")}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${
            selectedLocationId === null ? "opacity-50" : ""
          }`}
          onClick={() => handleSelectLocation(null)}
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300">
            <span className="text-gray-500 font-medium">
              {t("homepage.SelectForm.none")}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium">
            {t("homepage.SelectForm.none")}
          </p>
        </div>

        {locations.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              selectedLocationId === item.id ? "opacity-50" : ""
            }`}
            onClick={() => handleSelectLocation(item.id)}
          >
            <img
              src={item.hinhAnh}
              alt={item.tinhThanh}
              className="w-16 h-16 object-cover rounded-md shadow-sm"
            />
            <p className="mt-2 text-sm font-medium">{item.tinhThanh}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const guestContent = (
    <div className="flex items-center justify-between w-40 p-2">
      <p className="text-gray-800 font-medium">
        {t("homepage.SelectForm.guest")}
      </p>
      <div className="flex items-center gap-2">
        <Button
          shape="circle"
          icon={<MinusOutlined />}
          size="small"
          disabled={soLuongKhach <= 1}
          onClick={() => dispatch(setSoLuongKhach(soLuongKhach - 1))}
        />
        <span className="font-semibold">{soLuongKhach}</span>
        <Button
          shape="circle"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => dispatch(setSoLuongKhach(soLuongKhach + 1))}
        />
      </div>
    </div>
  );

  const dateContent = (
    <div className="p-4">
      <DateRange
        className="w-full"
        ranges={dateRange}
        onChange={handleDateChange}
        months={1}
        minDate={new Date()}
        rangeColors={["rgb(254, 107, 110)"]}
        locale={vi}
        maxDate={addDays(new Date(), 180)}
      />
    </div>
  );

  const selectedLocation = locations.find(
    (loc) => loc.id === selectedLocationId
  );

  return (
    <div className={`${themeMode} mt-16 mb-10 px-2`}>
      <div className="container w-full bg-white border rounded-lg md:rounded-full shadow-sm py-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        {/* Địa điểm */}
        <Popover
          content={locationContent}
          trigger="click"
          placement="bottom"
          open={openLocation}
          onOpenChange={(visible) => setOpenLocation(visible)}
        >
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {t("homepage.SelectForm.location")}
            </p>
            <span className="text-black text-lg sm:text-xl">
              {selectedLocation
                ? selectedLocation.tinhThanh
                : t("homepage.SelectForm.choose_location")}
            </span>
          </div>
        </Popover>

        {/* Thời gian */}
        <Popover content={dateContent} trigger="click" placement="bottom">
          <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r px-4 cursor-pointer">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {t("homepage.SelectForm.time")}
            </p>
            <span className="text-gray-800 text-base sm:text-lg">
              {dayjs(dateRange[0].startDate).format("DD MMMM YYYY")} -{" "}
              {dayjs(dateRange[0].endDate).format("DD MMMM YYYY")}
            </span>
          </div>
        </Popover>

        {/* Thêm khách */}
        <div className="flex items-center justify-center text-center px-4">
          <Popover content={guestContent} trigger="click" placement="bottom">
            <div className="flex items-center cursor-pointer">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  {t("homepage.SelectForm.Add_guest")}
                </p>
                <span className="text-gray-800 text-base sm:text-lg">
                  {soLuongKhach} {t("homepage.SelectForm.guest")}
                </span>
              </div>
              <div className="ml-10">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default SelectForm;
