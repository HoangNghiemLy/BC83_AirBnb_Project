import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  App as AntdApp,
  Upload,
  type UploadFile,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { setIsModalOpenAction } from "../../store/slices/quanLyViTriSlice";
import { viTriServices } from "../../services/viTriServices";
import { fetchListViTriAction } from "../../store/thunks/quanLyViTriThunks";
import type { UploadChangeParam } from "antd/es/upload";
import type { RootState, AppDispatch } from "../../store/store";
import type { CreateViTriDto } from "../../types/ViTri";
import { Spin } from "antd";
interface ModalQLViTriProps {
  valueInput: string;
}

interface FormValues {
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: UploadFile[];
}

export default function ModalQLViTri({ valueInput }: ModalQLViTriProps) {
  const { isModalOpen, currentPage } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { message } = AntdApp.useApp();
  React.useEffect(() => {
    if (isModalOpen) {
      setModalLoading(true);
      setTimeout(() => {
        form.resetFields();
        setModalLoading(false);
      }, 300);
    }
  }, [isModalOpen, form]);
  // loading khi mở modal
  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList ?? [];
  };

  const hideModal = () => {
    dispatch(setIsModalOpenAction(false));
  };

  const handleOk = async (values: FormValues) => {
    try {
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }

      setLoading(true);
      const file = values.hinhAnh[0]?.originFileObj as File;
      const formData = new FormData();
      formData.append("formFile", file, file.name);

      const valuesClone: CreateViTriDto = {
        tenViTri: values.tenViTri,
        tinhThanh: values.tinhThanh,
        quocGia: values.quocGia,
        hinhAnh: "",
      };
      const addRes = await viTriServices.addVitri(valuesClone, token);
      const addedId = addRes.data.content.id;

      await viTriServices.uploadHinhViTri(formData, addedId, token);

      dispatch(fetchListViTriAction({ currentPage, valueInput }));
      dispatch(setIsModalOpenAction(false));
      message.success("Thêm thành công");
    } catch (error) {
      console.error(error);
      message.error("Thêm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      closable={false}
      open={isModalOpen}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: { backgroundColor: "rgb(254 107 110)" },
      }}
      onCancel={hideModal}
      afterOpenChange={(open) => {
        if (!open) form.resetFields();
      }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          onFinish={handleOk}
        >
          <Spin spinning={modalLoading}>{dom}</Spin>
        </Form>
      )}
    >
      <h1 className="my-3 text-2xl text-center">Thêm vị trí mới</h1>

      {/* Upload hình */}
      <Form.Item
        label="Thêm hình"
        name="hinhAnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Vui lòng chọn hình!" }]}
        hasFeedback
      >
        <Upload listType="picture" maxCount={1} accept="image/png, image/jpeg">
          <button
            className="border-2 border-[#FE6B6E] py-2 px-3 rounded-md"
            type="button"
          >
            <PlusOutlined />
          </button>
        </Upload>
      </Form.Item>

      {/* Tên vị trí */}
      <Form.Item
        name="tenViTri"
        label="Tên vị trí"
        rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>

      {/* Tỉnh thành */}
      <Form.Item
        name="tinhThanh"
        label="Tỉnh thành"
        rules={[{ required: true, message: "Vui lòng nhập tỉnh thành!" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>

      {/* Quốc gia */}
      <Form.Item
        name="quocGia"
        label="Quốc gia"
        rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>
    </Modal>
  );
}
