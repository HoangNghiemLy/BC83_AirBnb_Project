import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  App as AntdApp,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalOpenAction } from "../../store/slices/quanLyNguoiDungSlice";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import dayjs, { Dayjs } from "dayjs";
import { fetchListUserAction } from "../../store/thunks/quanLyNguoiDungThunks";
import type { RootState, AppDispatch } from "../../store/store";
import type { ReactElement } from "react";
import type { RadioChangeEvent } from "antd";
interface ModalQLNguoiDungProps {
  valueInput: string;
}

export interface FormValues {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  birthday: Dayjs;
  avatar?: string;
  gender: boolean;
  role: "USER" | "ADMIN" | string;
}

export default function ModalQLNguoiDung({
  valueInput,
}: ModalQLNguoiDungProps): ReactElement {
  const { isModalOpen, currentPage } = useSelector(
    (state: RootState) => state.quanLyNguoiDungSlice
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [radioValue, setRadioValue] = useState<"ADMIN" | "USER" | undefined>();
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  const onChangeRadio = (e: RadioChangeEvent): void => {
    setRadioValue(e.target.value as "ADMIN" | "USER");
  };

  const hideModal = (): void => {
    dispatch(setIsModalOpenAction(false));
  };

  const handleOk = async (values: FormValues): Promise<void> => {
    const submitValues = {
      ...values,
      birthday: values.birthday.format("YYYY-MM-DD"),
    };

    setLoading(true);

    try {
      await nguoiDungServices.createUser(submitValues);
      dispatch(fetchListUserAction({ currentPage, valueInput }));
      dispatch(setIsModalOpenAction(false));
      message.success("Thêm thành công");
    } catch (err: any) {
      console.error(err);
            const errorContent = err?.response?.data?.content?.toLowerCase() || '';
      if (errorContent.includes('email') && errorContent.includes('đã tồn tại')) {
        message.error("Email đã tồn tại trong hệ thống!");
      } else {
        message.error("Thêm thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      closable={false}
      open={isModalOpen}
      confirmLoading={loading}
      okText="Thêm"
      cancelText="Hủy"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: {
          backgroundColor: "rgb(254 107 110)",
        },
      }}
      onCancel={hideModal}
      destroyOnHidden
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
      <h1 className="my-3 text-2xl text-center">Thêm người dùng mới</h1>
      <Row gutter={24}>
        {/* Col left */}
        <Col span={24} md={12}>
          {/* name */}
          <Form.Item
            name="name"
            label="Tên người dùng"
            tooltip="Tên hiển thị với mọi người"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên người dùng!",
                whitespace: true,
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          {/* phone */}
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
                whitespace: true,
              },
              { pattern: /^[0-9]+$/, message: "Phải là số" },
              { pattern: /^\d{10}$/, message: "Phải có 10 số" },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          {/* gender */}
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            hasFeedback
          >
            <Select
              placeholder="Chọn giới tính"
              options={[
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* Col right */}
        <Col span={24} md={12}>
          {/* email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              {
                required: true,
                message: "Vui lòng nhập email!",
                whitespace: true,
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          {/* password */}
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
                whitespace: true,
              },
              { pattern: /[A-Za-z]/, message: "Phải có ít nhất 1 chữ!" },
              { pattern: /\d/, message: "Phải có ít nhất 1 số!" },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* birthday */}
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            hasFeedback
          >
            <DatePicker
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* role */}
      <Form.Item
        name="role"
        label="Chức vụ"
        rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
        hasFeedback
      >
        <Radio.Group onChange={onChangeRadio} value={radioValue}>
          <Radio value="ADMIN">Admin</Radio>
          <Radio value="USER">User</Radio>
        </Radio.Group>
      </Form.Item>
    </Modal>
  );
}
