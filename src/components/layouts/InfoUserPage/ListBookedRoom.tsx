import { useEffect, useState } from "react";
import { Button, Card, App as AntdApp, Popconfirm, Pagination } from "antd";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  createListBookedRoomAction,
  createListIdBookingAction,
} from "../../../store/thunks/infoUserThunks";
import { fetchListViTriAction } from "../../../store/thunks/quanLyViTriThunks";
import { useNavigate } from "react-router-dom";
import {
  EnvironmentOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { viTriServices } from "../../../services/viTriServices";
import { setListViTriAction } from "../../../store/slices/quanLyViTriSlice";
import dayjs from "dayjs";
import { bookingServices } from "../../../services/bookingServices";
import { getListIdBookingAction } from "../../../store/thunks/bookingThunks";
import type { RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";

export default function ListBookedRoom() {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const idUser = useAppSelector(
    (state: RootState) => state.userSlice.loginData?.user.id
  );
  const { listIdBooking, listBookedRoom, listBooked } = useAppSelector(
    (state: RootState) => state.infoUserSlice
  );
  const { listViTri } = useAppSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fixed items per page

  useEffect(() => {
    viTriServices
      .getListViTri()
      .then((result) => {
        dispatch(setListViTriAction(result.data.content));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch]);
  useEffect(() => {
    if (idUser !== undefined) {
      dispatch(createListIdBookingAction(idUser));
    }
  }, [dispatch, idUser]);
  useEffect(() => {
    if (listIdBooking.length > 0) {
      dispatch(createListBookedRoomAction(listIdBooking));
    }
  }, [dispatch, listIdBooking]);
  useEffect(() => {
    dispatch(fetchListViTriAction({ currentPage: 1, valueInput: "" }));
  }, [dispatch]);

  const renderTinhThanh = (id: string | number) => {
    const index: string | number = listViTri.findIndex(
      (viTri) => viTri.id === id
    );
    if (index !== -1) {
      return listViTri[index].tinhThanh;
    }
  };

  const renderDateBookRoom = (idBooking: string | number) => {
    const index = listBooked.findIndex((room) => room.id === idBooking);
    if (index !== -1) {
      const ngayDen = dayjs(listBooked[index].ngayDen).format("DD/MM/YYYY");
      const ngayDi = dayjs(listBooked[index].ngayDi).format("DD/MM/YYYY");
      return (
        <span className="text-sm block">
          {ngayDen} - {ngayDi}
        </span>
      );
    }
  };

  const renderRoomInfo = (
    maPhong: number | string,
    idBooking: number | undefined
  ) => {
    const index = listBookedRoom.findIndex((room) => room.id === maPhong);
    if (index !== -1) {
      const room = listBookedRoom[index];
      // console.log("Check room.dieuHoa: ", room.dieuHoa);
      return (
        <Card hoverable data-aos="zoom-in" className="border-2">
          <div className="grid grid-cols1 md:grid-cols-2 gap-5 z-0">
            <div className="absolute top-0 right-0 grid grid-cols1 md:flex gap-2 z-10">
              <Button
                className="h-8 w-8 text-blue-500"
                onClick={() => {
                  navigate(`/room-detail/${room.id}`);
                }}
              >
                <InfoCircleOutlined />
              </Button>

              <Popconfirm
                title={t("inforUser.deleteRoom")}
                description={t("inforUser.sureDelete")}
                onConfirm={() => {
                  if (idBooking !== undefined) {
                    confirm(idBooking);
                  } else {
                    message.error(t("message.error.not-id"));
                  }
                }}
                okText={t("inforUser.yes")}
                cancelText={t("inforUser.no")}
                okButtonProps={{
                  danger: true,
                }}
                className="z-50"
              >
                <Button className="h-8 w-8 text-primary">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </div>
            <div className="h-48">
              <img
                src={room.hinhAnh}
                alt=""
                className="h-full object-cover rounded-md"
              />
            </div>
            <div className="divide-y-2">
              <div className="border-b-2 border-gray-300">
                <h1 className="text-lg font-bold">{room.tenPhong}</h1>
                <div className=" text-gray-400">
                  {typeof idBooking !== "undefined" &&
                    renderDateBookRoom(idBooking)}
                </div>

                <p className="text-sm">
                  <EnvironmentOutlined className="mr-1" />
                  {renderTinhThanh(room.maViTri)}
                </p>
              </div>

              <div className="mt-2 flex justify-start gap-5 text-gray-500 border-b-2 border-gray-300">
                <ul>
                  <li>
                    {room.phongNgu} {t("rooms.Bedrooms")}
                  </li>
                  <li>
                    {room.giuong} {t("rooms.Beds")}
                  </li>
                  <li>
                    {room.phongTam} {t("rooms.Bathrooms")}
                  </li>
                </ul>
                <ul>
                  <li>
                    {room.dieuHoa ? (
                      <CheckOutlined className="text-xs" />
                    ) : (
                      <CloseOutlined className="text-xs" />
                    )}{" "}
                    {t("detailPage.amenities.airConditioner")}
                  </li>
                  <li>
                    {room.bep ? (
                      <CheckOutlined className="text-xs" />
                    ) : (
                      <CloseOutlined className="text-xs" />
                    )}{" "}
                    {t("detailPage.amenities.kitchen")}
                  </li>
                  <li>
                    {room.hoBoi ? (
                      <CheckOutlined className="text-xs" />
                    ) : (
                      <CloseOutlined className="text-xs" />
                    )}{" "}
                    {t("detailPage.amenities.pool")}
                  </li>
                </ul>
              </div>
              <div className="mt-2">
                <p>
                  <span className="font-bold">$ {room.giaTien}</span> /{" "}
                  {t("rooms.night")}
                </p>
              </div>
            </div>
          </div>
        </Card>
      );
    }
  };

  const renderListBookedRoom = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRooms = listBooked.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return currentRooms.map((room) => (
      <div className="mt-5 duration-300" key={room.id}>
        {renderRoomInfo(room.maPhong, room.id)}
      </div>
    ));
  };

  const handleDeleteBookedRoom = (id: number | string) => {
    bookingServices
      .deleteBooking(id)
      .then(() => {
        message.success(t("message.success.delete"));
        dispatch(getListIdBookingAction(idUser as number | string));
        if (idUser !== undefined) {
          dispatch(createListIdBookingAction(idUser));
        }
      })
      .catch((err) => {
        message.error(t("message.error.delete"));
        console.error(err);
      });
  };

  const confirm = (id: number | string) => {
    handleDeleteBookedRoom(id);
  };

  return (
    <div>
      {listBookedRoom.length > 0 ? (
        <div>
          <h1 className="text-xl font-bold mb-5">
            {t("inforUser.roomRented")}
          </h1>
          {/* Pagination ở trên */}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={listBooked.length}
            showSizeChanger={false}
            onChange={(page) => {
              setCurrentPage(page);
            }}
            className="my-4"
          />
          <div className="relative">{renderListBookedRoom()}</div>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-bold">{t("inforUser.roomRented")}</h1>
          <a href="/" className="hover:underline text-primary">
            {t("inforUser.notRoom")}
          </a>
        </div>
      )}
    </div>
  );
}
