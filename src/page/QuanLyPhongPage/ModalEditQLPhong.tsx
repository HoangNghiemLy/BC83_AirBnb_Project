import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Form,
  App as AntdApp,
  Upload,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Switch,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import type { AppDispatch, RootState } from "../../store/store"; // Cập nhật đường dẫn đúng
import { setIsModalEditOpenAction } from "../../store/slices/quanLyPhongSlice";
import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../../store/thunks/quanLyPhongThunks";
import { phongServices } from "../../services/phongServices";
import type { Phong } from "../../types/Phong";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect } from "react";

interface ModalEditQLPhongProps {
  valueInput: string;
}

interface FormValues extends Omit<Phong, "hinhAnh"> {
  hinhAnh: UploadFile[] | string;
}

export default function ModalEditQLPhong({
  valueInput,
}: ModalEditQLPhongProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isModalEditOpen, phongInfo, currentPage } = useSelector(
    (state: RootState) => state.quanLyPhongSlice
  );
  const { message } = AntdApp.useApp();
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const { listViTri } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  const [form] = Form.useForm();
  useEffect(() => {
    if (phongInfo) {
      const {
        id,
        tenPhong,
        khach,
        phongNgu,
        giuong,
        phongTam,
        moTa,
        giaTien,
        mayGiat,
        banLa,
        tivi,
        dieuHoa,
        wifi,
        bep,
        doXe,
        hoBoi,
        banUi,
        maViTri,
      } = phongInfo;

      form.setFieldsValue({
        id,
        tenPhong,
        khach,
        phongNgu,
        giuong,
        phongTam,
        moTa,
        giaTien,
        mayGiat,
        banLa,
        tivi,
        dieuHoa,
        wifi,
        bep,
        doXe,
        hoBoi,
        banUi,
        maViTri,
      });
    } else {
      form.resetFields();
    }
  }, [phongInfo, form]);

  const normFile = (e: UploadChangeParam): UploadFile[] => {
    return Array.isArray(e) ? e : e?.fileList;
  };

  const hideModal = () => {
    form.resetFields(); // thêm dòng này
    dispatch(setIsModalEditOpenAction(false));
  };

  const handleOk = async (values: FormValues) => {
    try {
      let imageToUpdate: string = phongInfo?.hinhAnh ?? "";

      if (Array.isArray(values.hinhAnh) && values.hinhAnh[0]?.originFileObj) {
        const file = values.hinhAnh[0].originFileObj as RcFile;
        const formData = new FormData();
        formData.append("formFile", file, file.name);
        if (!token) {
          message.error("Bạn chưa đăng nhập!");
          return;
        }
        const uploadRes = await phongServices.uploadHinhPhong(
          formData,
          values.id,
          token
        );
        imageToUpdate = uploadRes.data.content.hinhAnh;
      }

      const updatedValues = { ...values, hinhAnh: imageToUpdate };
      if (!token) {
        message.error("Bạn chưa đăng nhập!");
        return;
      }
      await phongServices.editPhong(values.id, updatedValues, token);

      dispatch(fetchPhongInfoAction(String(values.id)));
      dispatch(fetchListPhongAction({ currentPage, valueInput }));
      dispatch(setIsModalEditOpenAction(false));
      message.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  const renderSelectOption = () =>
    listViTri.map((viTri) => ({
      value: viTri.id,
      label: (
        <div className="flex items-center">
          <img
            src={viTri.hinhAnh}
            alt="avatar"
            className="mr-1  h-7 w-10 object-cover rounded-sm"
          />
          <p>{viTri.tenViTri}</p>
        </div>
      ),
    }));

  // const renderInitialValues = () => {
  //   if (!phongInfo) return undefined;
  //   const {
  //     id,
  //     tenPhong,
  //     khach,
  //     phongNgu,
  //     giuong,
  //     phongTam,
  //     moTa,
  //     giaTien,
  //     mayGiat,
  //     banLa,
  //     tivi,
  //     dieuHoa,
  //     wifi,
  //     bep,
  //     doXe,
  //     hoBoi,
  //     banUi,
  //     maViTri,
  //   } = phongInfo;

  //   return {
  //     id,
  //     tenPhong,
  //     khach,
  //     phongNgu,
  //     giuong,
  //     phongTam,
  //     moTa,
  //     giaTien,
  //     mayGiat,
  //     banLa,
  //     tivi,
  //     dieuHoa,
  //     wifi,
  //     bep,
  //     doXe,
  //     hoBoi,
  //     banUi,
  //     maViTri,
  //   };
  // };

  return (
    <div>
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
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            // initialValues={renderInitialValues()}
            onFinish={handleOk}
          >
            {dom}
          </Form>
        )}
      >
        <h1 className="my-3 text-2xl text-center">Cập nhật phòng thuê</h1>
        <img src={phongInfo?.hinhAnh} alt="" className="h-48 w-full" />
        {/* hinhAnh */}
        <Form.Item
          label=""
          name="hinhAnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          hasFeedback
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg"
            customRequest={({ onSuccess }) => {
              if (onSuccess) onSuccess("ok");
            }}
          >
            <button
              className="border-2 border-solid py-2 px-3 rounded-md"
              type="button"
            >
              Đổi hình
            </button>
          </Upload>
        </Form.Item>
        <Row gutter={24}>
          {/* Col left */}
          <Col span={24} md={12}>
            <Form.Item name="id" label="Mã phòng thuê">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="moTa"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Nhập mô tả vào đây" />
            </Form.Item>
            <Form.Item
              name="khach"
              label="Số khách"
              rules={[{ required: true, message: "Vui lòng nhập số khách!" }]}
              hasFeedback
            >
              <InputNumber
                min={1}
                max={10}
                placeholder="1"
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="giuong"
              label="Số giường ngủ"
              rules={[
                { required: true, message: "Vui lòng nhập số giường ngủ!" },
              ]}
              hasFeedback
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>
            <Form.Item
              name="giaTien"
              label="Giá phòng"
              rules={[{ required: true, message: "Vui lòng nhập giá phòng!" }]}
              hasFeedback
            >
              <InputNumber min={1} placeholder="Đơn vị $" className="w-full" />
            </Form.Item>
          </Col>
          {/* Col right */}
          <Col span={24} md={12}>
            <Form.Item
              name="tenPhong"
              label="Tên phòng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên phòng!",
                  whitespace: true,
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Điền tên phòng..." />
            </Form.Item>
            <Form.Item
              name="maViTri"
              label="Vị trí"
              rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
              hasFeedback
            >
              <Select
                placeholder="Chọn vị trí"
                options={renderSelectOption()}
              />
            </Form.Item>
            <Form.Item
              name="phongNgu"
              label="Số phòng ngủ"
              rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
              hasFeedback
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>
            <Form.Item
              name="phongTam"
              label="Số phòng tắm"
              rules={[
                { required: true, message: "Vui lòng nhập số phòng tắm!" },
              ]}
              hasFeedback
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>
          </Col>
        </Row>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "mayGiat",
            "banLa",
            "tivi",
            "dieuHoa",
            "wifi",
            "bep",
            "doXe",
            "hoBoi",
            "banUi",
          ].map((item) => (
            <Form.Item
              key={item}
              name={item}
              label={item.replace(/([A-Z])/g, " $1")}
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          ))}
        </div>
      </Modal>
    </div>
  );
}
