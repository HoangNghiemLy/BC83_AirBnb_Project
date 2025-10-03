import React, { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchDetailRoomAction } from "../../store/thunks/detailRoomThunks";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Image, Spin } from "antd";
import InfoRoomLeft from "./InfoRoomLeft";
import InfoRoomRight from "./InfoRoomRight";
import Comment from "./Comment";
import ModalCalendar from "./ModalCalendar";
import { checkIsBookedAction } from "../../store/thunks/bookingThunks";
import type { RootState, AppDispatch } from "../../store/store";
import type { Phong } from "../../types/Phong";
import { useTranslation } from "react-i18next";

export default function RoomDetailPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { id: idRoom } = useParams<{ id: string }>();

  const { infoRoom } = useSelector((state: RootState) => state.detailRoomSlice);
  const { listIdBooking } = useSelector(
    (state: RootState) => state.bookingSlice
  );
  const { themeMode } = useSelector((state: RootState) => state.darkModeSlice);

  useEffect(() => {
    dispatch(fetchDetailRoomAction(idRoom as string)).then((result) => {
      const phong = result.payload as Phong;
      dispatch(
        checkIsBookedAction({
          listIdBooking: listIdBooking ?? [],
          idRoom: phong.id,
        })
      );
    });
  }, [dispatch, idRoom, listIdBooking]);

  useEffect(() => {
    if (infoRoom?.id && listIdBooking) {
      dispatch(checkIsBookedAction({ listIdBooking, idRoom: infoRoom.id }));
    }
  }, [dispatch, listIdBooking, infoRoom?.id]);

  if (!infoRoom) {
    return (
      <div className="flex justify-center items-center min-h-[300px] bg-loading">
        <Spin tip={t("comment.loading")} size="large" />
      </div>
    );
  }

  const renderTienIch = () => {
    const tienIchContent: React.ReactNode[] = [];

    const tienIchMapping: Record<
      string,
      { labelKey: string; icon: JSX.Element }
    > = {
      mayGiat: {
        labelKey: "detailPage.amenities.washingMachine",
        icon: <i className="fa fa-water" />,
      },
      banLa: {
        labelKey: "detailPage.amenities.iron",
        icon: <i className="fa fa-tshirt" />,
      },
      tivi: {
        labelKey: "detailPage.amenities.tv",
        icon: <i className="fa fa-desktop" />,
      },
      dieuHoa: {
        labelKey: "detailPage.amenities.airConditioner",
        icon: <i className="fa fa-temperature-low" />,
      },
      wifi: {
        labelKey: "detailPage.amenities.wifi",
        icon: <i className="fa fa-wifi" />,
      },
      bep: {
        labelKey: "detailPage.amenities.kitchen",
        icon: <i className="fa fa-utensils" />,
      },
      doXe: {
        labelKey: "detailPage.amenities.parking",
        icon: <i className="fa fa-car-side" />,
      },
      hoBoi: {
        labelKey: "detailPage.amenities.pool",
        icon: <i className="fa fa-swimming-pool" />,
      },
      baiUi: {
        labelKey: "detailPage.amenities.steamIron",
        icon: <i className="fa fa-water" />,
      },
    };
    (Object.keys(infoRoom) as Array<keyof typeof infoRoom>).forEach((key) => {
      if (infoRoom[key] && tienIchMapping[key]) {
        const { labelKey, icon } = tienIchMapping[key];
        tienIchContent.push(
          <div key={key} className="flex items-center gap-2">
            {icon} {t(labelKey)}
          </div>
        );
      }
    });
    if (tienIchContent.length === 0) {
      return (
        <p className="text-gray-500 italic">{t("detailPage.noutilities")}</p>
      );
    }
    return tienIchContent;
  };

  return (
    <div className={`${themeMode}`}>
      <div className="pt-28 space-y-5 container">
        <h1 className="text-2xl font-bold">{infoRoom.tenPhong}</h1>
        <div className="flex gap-2 items-center ">
          <EnvironmentOutlined />
          <Link to="#" className="text-Vietnam text-locale">
            {t("detailPage.Vietnam")}
          </Link>
        </div>

        <div className="w-full ">
          <Image src={infoRoom.hinhAnh} className="rounded-lg" width="100%" />
        </div>

        <div className="space-y-5 ">
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:flex gap-5">
              <InfoRoomLeft />
              <InfoRoomRight />
            </div>

            <div className="border-b-2 border-gray-300">
              <h1 className="text-xl font-bold">{t("detailPage.utilities")}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {renderTienIch()}
              </div>
            </div>
          </div>

          <Comment idRoom={idRoom || ""} />
        </div>

        <ModalCalendar />
      </div>
    </div>
  );
}
