import { useEffect, useState } from "react";
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

import type { RadioChangeEvent } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import dayjs, { Dayjs } from "dayjs";
import { setIsModalEditOpenAction } from "../../store/slices/quanLyNguoiDungSlice";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../../store/thunks/quanLyNguoiDungThunks";
import type { RootState, AppDispatch } from "../../store/store";
import type { ReactElement } from "react";

interface ModalEditProps {
  valueInput: string;
}

interface FormValues {
  id: number;
  name: string;
  phone: string;
  email: string;
  gender: boolean;
  birthday: Dayjs;
  role: "ADMIN" | "USER";
}

export default function ModalEditQLNguoiDung({
  valueInput,
}: ModalEditProps): ReactElement {
  const { isModalEditOpen, userInfo, currentPage } = useSelector(
    (state: RootState) => state.quanLyNguoiDungSlice
  );
  const [form] = Form.useForm<FormValues>();
  const [radioValue, setRadioValue] = useState<"ADMIN" | "USER">("USER");
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        id: userInfo.id,
        name: userInfo.name,
        phone: userInfo.phone || "",
        email: userInfo.email,
        gender: userInfo.gender,
        birthday: dayjs(userInfo.birthday),
        role: userInfo.role as "ADMIN" | "USER",
      });
      setRadioValue(userInfo.role as "ADMIN" | "USER");
    } else {
      form.resetFields();
    }
  }, [userInfo, form]);

  const onChangeRadio = (e: RadioChangeEvent): void => {
    setRadioValue(e.target.value);
    form.setFieldValue("role", e.target.value);
  };

  const hideModal = (): void => {
    dispatch(setIsModalEditOpenAction(false));
  };

  const handleOk = (values: FormValues): void => {
    const submitValues = {
      ...values,
      birthday: values.birthday.format("YYYY-MM-DD"),
    };

    nguoiDungServices
      .editUser(userInfo!.id, submitValues)
      .then(() => {
        dispatch(fetchUserInfoAction(userInfo!.id));
        dispatch(fetchListUserAction({ currentPage, valueInput }));
        dispatch(setIsModalEditOpenAction(false));
        message.success("Cập nhật thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Cập nhật thất bại");
      });
  };

  const renderInitialValues = () => {
    if (!userInfo) return undefined;
    return {
      id: userInfo.id,
      name: userInfo.name,
      phone: userInfo.phone || "",
      email: userInfo.email,
      gender: userInfo.gender,
      birthday: dayjs(userInfo.birthday),
      role: userInfo.role,
    };
  };

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
      onCancel={hideModal}
      destroyOnHidden
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_edit_user"
          onFinish={handleOk}
          initialValues={renderInitialValues()}
        >
          {dom}
        </Form>
      )}
    >
      <h1 className="my-3 text-2xl text-center">Cập nhật người dùng</h1>
      <Row gutter={24}>
        <Col span={24} md={12}>
          <Form.Item name="id" label="Mã người dùng">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]+$/, message: "Phải là số!" },
              { pattern: /^\d{10}$/, message: "Phải có đúng 10 số!" },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

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

        <Col span={24} md={12}>
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập email!" },
            ]}
            hasFeedback
          >
            <Input disabled />
          </Form.Item>

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
