import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Modal,
  Input,
  App as AntdApp,
  InputNumber,
  DatePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import type { RootState } from "../../store/store";
import { setIsModalEditOpenAction } from "../../store/slices/quanLyBookingSlice";
import { bookingServices } from "../../services/bookingServices";
import { fetchBookingInfoAction } from "../../store/thunks/quanLyBookingThunks";
import type { AppDispatch } from "../../store/store";
import type { BookingPayload } from "../../types/Booking";
import { useState } from "react";
interface ModalQLBookingProps {
  fetchSearchBooking: (keyword: string) => void;
  valueInput: string;
}

interface BookingFormValues {
  id: string;
  maPhong: string;
  ngayDen: Dayjs;
  ngayDi: Dayjs;
  soLuongKhach: number;
  maNguoiDung: string;
}

export default function ModalQLBooking({
  fetchSearchBooking,
  valueInput,
}: ModalQLBookingProps) {
  const { isModalEditOpen, bookingInfo } = useSelector(
    (state: RootState) => state.quanLyBookingSlice
  );
  const [form] = Form.useForm<BookingFormValues>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { message } = AntdApp.useApp();
  const hideModal = () => {
    form.resetFields();
    dispatch(setIsModalEditOpenAction(false));
  };
  useEffect(() => {
    if (bookingInfo) {
      form.setFieldsValue({
        id: String(bookingInfo.id),
        maPhong: String(bookingInfo.maPhong),
        ngayDen: dayjs(bookingInfo.ngayDen),
        ngayDi: dayjs(bookingInfo.ngayDi),
        soLuongKhach: bookingInfo.soLuongKhach,
        maNguoiDung: String(bookingInfo.maNguoiDung),
      });
    } else {
      form.resetFields();
    }
  }, [bookingInfo, form]);
  const handleOk = (values: BookingFormValues) => {
    const payload: BookingPayload = {
      id: Number(values.id),
      maPhong: Number(values.maPhong),
      ngayDen: values.ngayDen.toISOString(),
      ngayDi: values.ngayDi.toISOString(),
      soLuongKhach: values.soLuongKhach,
      maNguoiDung: Number(values.maNguoiDung),
    };
    if (payload.id === undefined) {
      return;
    }
    setLoading(true);
    bookingServices
      .editBooking(payload.id, payload)
      .then(() => {
        dispatch(fetchBookingInfoAction(String(payload.id)));
        fetchSearchBooking(valueInput);
        dispatch(setIsModalEditOpenAction(false));
        message.success("Cập nhật thành công");
      })
      .catch(() => {
        message.error("Cập nhật thất bại");
      })
      .finally(() => setLoading(false));
  };

  // const renderInitialValues = (): BookingFormValues | undefined => {
  //   if (bookingInfo) {
  //     return {
  //       id: String(bookingInfo.id),
  //       maPhong: String(bookingInfo.maPhong),
  //       ngayDen: dayjs(bookingInfo.ngayDen),
  //       ngayDi: dayjs(bookingInfo.ngayDi),
  //       soLuongKhach: bookingInfo.soLuongKhach,
  //       maNguoiDung: String(bookingInfo.maNguoiDung),
  //     };
  //   }
  // };

  return (
    <Modal
      closable={false}
      open={isModalEditOpen}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: {
          backgroundColor: "rgb(254 107 110)",
        },
      }}
      confirmLoading={loading}
      onCancel={hideModal}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          onFinish={handleOk}
        >
          {dom}
        </Form>
      )}
    >
      <h1 className="my-3 text-2xl text-center">Cập nhật booking</h1>

      <Form.Item name="id" label="Mã booking">
        <Input disabled />
      </Form.Item>

      <Form.Item name="maPhong" label="Mã phòng">
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="ngayDen"
        label="Ngày đến"
        rules={[{ required: true, message: "Vui lòng chọn ngày đến!" }]}
        hasFeedback
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="ngayDi"
        label="Ngày đi"
        rules={[{ required: true, message: "Vui lòng chọn ngày đi!" }]}
        hasFeedback
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="soLuongKhach"
        label="Số khách"
        rules={[{ required: true, message: "Vui lòng nhập số khách!" }]}
        hasFeedback
      >
        <InputNumber min={1} max={10} placeholder="1" className="w-full" />
      </Form.Item>

      <Form.Item name="maNguoiDung" label="Mã người dùng">
        <Input disabled />
      </Form.Item>
    </Modal>
  );
}
