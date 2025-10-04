import {
  Modal,
  Form,
  Input,
  App as AntdApp,
  Upload,
  type UploadFile,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalEditOpenAction } from "../../store/slices/quanLyViTriSlice";
import { viTriServices } from "../../services/viTriServices";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../../store/thunks/quanLyViTriThunks";
import type { RootState, AppDispatch } from "../../store/store";
import type { UploadChangeParam } from "antd/es/upload";
import { useEffect } from "react";
interface ModalEditQLViTriProps {
  valueInput: string;
}

interface FormValues {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh?: UploadFile[];
}

export default function ModalEditQLViTri({
  valueInput,
}: ModalEditQLViTriProps) {
  const { isModalEditOpen, viTriInfo, currentPage } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  const { message } = AntdApp.useApp();
  // const { token } = useSelector(
  //   (state: RootState) => state.userSlice.loginData || {}
  // );
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  // const normFile = (e: any): UploadFile[] => {
  //   return Array.isArray(e) ? e : e?.fileList;
  // };
  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList;
  };
  const hideModal = () => {
    dispatch(setIsModalEditOpenAction(false));
  };
  useEffect(() => {
    if (viTriInfo) {
      form.setFieldsValue({
        id: viTriInfo.id,
        tenViTri: viTriInfo.tenViTri,
        tinhThanh: viTriInfo.tinhThanh,
        quocGia: viTriInfo.quocGia,
        hinhAnh: [], // Reset hình ảnh nếu cần
      });
    }
  }, [viTriInfo, form]);
  const handleOk = async (values: FormValues) => {
    try {
      const updatedData: Omit<FormValues, "hinhAnh"> & { hinhAnh: string } = {
        id: values.id,
        tenViTri: values.tenViTri,
        tinhThanh: values.tinhThanh,
        quocGia: values.quocGia,
        hinhAnh: viTriInfo?.hinhAnh || "",
      };

      if (values.hinhAnh && values.hinhAnh[0]?.originFileObj) {
        const file = values.hinhAnh[0].originFileObj as File;
        const formData = new FormData();
        formData.append("formFile", file, file.name);
        if (!token) {
          message.error("Bạn chưa đăng nhập!");
          return;
        }
        const uploadRes = await viTriServices.uploadHinhViTri(
          formData,
          values.id,
          token
        );
        updatedData.hinhAnh = uploadRes.data.content.hinhAnh;
      }
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }
      await viTriServices.editViTri(values.id, updatedData, token);
      dispatch(fetchViTriInfoAction(values.id));
      dispatch(fetchListViTriAction({ currentPage, valueInput }));
      dispatch(setIsModalEditOpenAction(false));
      message.success("Cập nhật thành công");
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  const renderInitialValues = () => {
    if (viTriInfo) {
      return {
        id: viTriInfo.id,
        tenViTri: viTriInfo.tenViTri,
        tinhThanh: viTriInfo.tinhThanh,
        quocGia: viTriInfo.quocGia,
      };
    }
    return {};
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
          name="form_in_modal"
          initialValues={renderInitialValues()}
          onFinish={handleOk}
        >
          {dom}
        </Form>
      )}
    >
      <h1 className="my-3 text-2xl text-center">Cập nhật vị trí</h1>
      {viTriInfo?.hinhAnh && (
        <img src={viTriInfo.hinhAnh} alt="" className="h-48 w-full" />
      )}
      {/* hinhAnh */}
      <Form.Item
        name="hinhAnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          listType="picture"
          maxCount={1}
          accept="image/png, image/jpeg"
          customRequest={({ onSuccess }) => onSuccess?.("ok")}
        >
          <button
            className="border-2 border-primary mt-3 py-2 px-3 rounded-md"
            type="button"
          >
            Đổi hình
          </button>
        </Upload>
      </Form.Item>

      <Form.Item name="id" label="Mã vị trí">
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="tenViTri"
        label="Tên vị trí"
        rules={[{ required: true, message: "Vui lòng nhập tên vị trí!" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tinhThanh"
        label="Tỉnh thành"
        rules={[{ required: true, message: "Vui lòng nhập tỉnh thành!" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>

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
