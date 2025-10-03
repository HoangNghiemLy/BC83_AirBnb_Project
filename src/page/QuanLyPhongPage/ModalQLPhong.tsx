import { useDispatch, useSelector } from "react-redux";
import { setIsModalOpenAction } from "../../store/slices/quanLyPhongSlice";
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
import { PlusOutlined } from "@ant-design/icons";
import { phongServices } from "../../services/phongServices";
import { fetchListPhongAction } from "../../store/thunks/quanLyPhongThunks";
import type { AppDispatch, RootState } from "../../store/store";
import type { CreatePhongDto, Phong } from "../../types/Phong";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";

interface ModalQLPhongProps {
  valueInput: string;
}

interface FormValues extends Omit<Partial<Phong>, "hinhAnh"> {
  hinhAnh: UploadFile[];
}

export default function ModalQLPhong({ valueInput }: ModalQLPhongProps) {
  const { isModalOpen, currentPage } = useSelector(
    (state: RootState) => state.quanLyPhongSlice
  );
  const { message } = AntdApp.useApp();
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const { listViTri } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm<FormValues>();

  const normFile = (e: UploadChangeParam<UploadFile>): UploadFile[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  const hideModal = () => {
    dispatch(setIsModalOpenAction(false));
  };

  const handleOk = (values: FormValues) => {
    const fileList = values.hinhAnh;
    const file = fileList?.[0]?.originFileObj as RcFile;

    const formData = new FormData();
    formData.append("formFile", file, file.name);

    // Tách riêng và ép kiểu từng trường
    const valuesClone: CreatePhongDto = {
      tenPhong: values.tenPhong ?? "",
      maViTri: values.maViTri ?? 0,
      phongNgu: values.phongNgu ?? 1,
      phongTam: values.phongTam ?? 1,
      moTa: values.moTa ?? "",
      khach: values.khach ?? 1,
      giuong: values.giuong ?? 1,
      giaTien: values.giaTien ?? 1,
      mayGiat: values.mayGiat ?? false,
      banLa: values.banLa ?? false,
      tivi: values.tivi ?? false,
      dieuHoa: values.dieuHoa ?? false,
      wifi: values.wifi ?? false,
      bep: values.bep ?? false,
      doXe: values.doXe ?? false,
      hoBoi: values.hoBoi ?? false,
      banUi: values.banUi ?? false,
    };
    if (!token) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }
    phongServices
      .createPhong(valuesClone, token)
      .then((result) => {
        phongServices
          .uploadHinhPhong(formData, result.data.content.id, token)
          .then(() => {
            dispatch(fetchListPhongAction({ currentPage, valueInput }));
            dispatch(setIsModalOpenAction(false));
            message.success("Thêm thành công");
          })
          .catch((err) => {
            message.error("Thêm thất bại");
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
        message.error("Thêm thất bại");
      });
  };

  const renderSelectOption = () => {
    return listViTri.map((viTri) => {
      return {
        value: viTri.id,
        label: (
          <div className="flex items-center">
            <img
              src={viTri.hinhAnh}
              alt="avatar"
              className="mr-1 h-7 w-10 object-cover rounded-sm"
            />
            <p>{viTri.tenViTri}</p>
          </div>
        ),
      };
    });
  };

  return (
    <Modal
      closable={false}
      open={isModalOpen}
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
      <h1 className="my-3 text-2xl text-center">Thêm phòng thuê</h1>
      <Form.Item
        label="Thêm hình"
        name="hinhAnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Vui lòng chọn hình!" }]}
        hasFeedback
      >
        <Upload
          listType="picture"
          maxCount={1}
          accept="image/png, image/jpeg"
          customRequest={({ onSuccess }) => onSuccess?.("ok")}
        >
          <button
            className="border-2 border-[#FE6B6E] py-2 px-3 rounded-md"
            type="button"
          >
            <PlusOutlined />
          </button>
        </Upload>
      </Form.Item>
      <Row gutter={24}>
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
            <Select placeholder="Chọn vị trí" options={renderSelectOption()} />
          </Form.Item>
          <Form.Item
            name="phongNgu"
            label="Số phòng ngủ"
            rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
            hasFeedback
          >
            <InputNumber min={1} max={10} placeholder="1" className="w-full" />
          </Form.Item>
          <Form.Item
            name="phongTam"
            label="Số phòng tắm"
            rules={[{ required: true, message: "Vui lòng nhập số phòng tắm!" }]}
            hasFeedback
          >
            <InputNumber min={1} max={10} placeholder="1" className="w-full" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
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
            <InputNumber min={1} max={10} placeholder="1" className="w-full" />
          </Form.Item>
          <Form.Item
            name="giuong"
            label="Số giường ngủ"
            rules={[
              { required: true, message: "Vui lòng nhập số giường ngủ!" },
            ]}
            hasFeedback
          >
            <InputNumber min={1} max={10} placeholder="1" className="w-full" />
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
        ].map((name) => (
          <Form.Item key={name} name={name} label={name} initialValue={true}>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              defaultChecked
            />
          </Form.Item>
        ))}
      </div>
    </Modal>
  );
}
