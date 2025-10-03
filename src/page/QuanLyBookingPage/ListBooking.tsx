import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ColumnsType } from "antd/es/table";
import { Popconfirm, Table, App as AntdApp } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { AppDispatch, RootState } from "../../store/store";
import {
  fetchBookingInfoAction,
  fetchListBookingAction,
} from "../../store/thunks/quanLyBookingThunks";
import { bookingServices } from "../../services/bookingServices";
import { setIsModalEditOpenAction } from "../../store/slices/quanLyBookingSlice";
import type { Booking } from "../../types/Booking";

// Kiểu dữ liệu cho props truyền vào component
interface ListBookingProps {
  fetchSearchBooking: (valueInput: string) => void;
  valueInput: string;
}

// Kiểu dữ liệu cho dữ liệu table
interface BookingTable extends Booking {
  key: number;
}

export default function ListBooking({
  fetchSearchBooking,
  valueInput,
}: ListBookingProps) {
  const { listBooking } = useSelector(
    (state: RootState) => state.quanLyBookingSlice
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setLoading(true);
    dispatch(fetchListBookingAction()).finally(() => setLoading(false));
  }, [dispatch]);

  // Cột của bảng
  const columns: ColumnsType<BookingTable> = [
    {
      title: "Mã đặt phòng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => (a.id ?? 0) - (b.id ?? 0),
    },
    {
      title: "Mã phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      sorter: (a, b) => a.maPhong - b.maPhong,
    },
    {
      title: "Mã người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      sorter: (a, b) => a.maNguoiDung - b.maNguoiDung,
    },
    {
      title: "Ngày đến",
      dataIndex: "ngayDen",
      key: "ngayDen",
    },
    {
      title: "Ngày đi",
      dataIndex: "ngayDi",
      key: "ngayDi",
    },
    {
      title: "Số khách",
      dataIndex: "soLuongKhach",
      key: "soLuongKhach",
      sorter: (a, b) => a.soLuongKhach - b.soLuongKhach,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_: unknown, dataObject: BookingTable) => (
        <div>
          <EditOutlined
            onClick={() => {
              if (dataObject.id !== undefined) {
                dispatch(fetchBookingInfoAction(dataObject.id.toString()))
                  .then(() => {
                    dispatch(setIsModalEditOpenAction(true));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else {
                console.error("ID không tồn tại");
              }
            }}
            className="text-2xl hover:cursor-pointer mr-2"
          />
          <Popconfirm
            title="Xoá đặt phòng"
            description="Bạn có chắc muốn xóa đặt phòng?"
            onConfirm={() => {
              if (dataObject.id !== undefined) {
                confirm(dataObject.id);
              } else {
                message.error("Không tìm thấy ID đặt phòng để xoá.");
              }
            }}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-2xl hover:cursor-pointer" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Render dữ liệu
  const renderListBooking = (): BookingTable[] => {
    return listBooking
      .filter(
        (booking): booking is Booking & { id: number } =>
          booking.id !== undefined
      )
      .map((booking) => ({
        ...booking,
        key: booking.id,
        ngayDen: dayjs(booking.ngayDen).format("DD/MM/YYYY"),
        ngayDi: dayjs(booking.ngayDi).format("DD/MM/YYYY"),
      }));
  };

  const handleDeleteBooking = (id: number) => {
    setLoading(true);
    bookingServices
      .deleteBooking(id)
      .then(() => {
        fetchSearchBooking(valueInput);
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      })
      .finally(() => setLoading(false));
  };

  const confirm = (id: number) => {
    handleDeleteBooking(id);
  };

  return (
    <Table
      dataSource={renderListBooking()}
      columns={columns}
      scroll={{ x: "max-content" }}
      showSorterTooltip={{
        target: "sorter-icon",
      }}
      loading={loading}
    />
  );
}
