import { useSelector, useDispatch } from "react-redux";
import { Form, Modal, App as AntdApp, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { setIsModalUpHinhOpenAction } from "../../../store/slices/infoUserSlice";
import { nguoiDungServices } from "../../../services/nguoiDungServices";
import { fetchInfoUserAction } from "../../../store/thunks/infoUserThunks";
import { setLoginData } from "../../../store/slices/userSlice";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import type { RootState, AppDispatch } from "../../../store/store";
import type { UploadFile } from "antd/es/upload/interface";
import type { FormValues, ModalUpHinhProps } from "../../../types/UpHinh";
import { useTranslation } from "react-i18next";

export default function ModalUpHinh({ idUser }: ModalUpHinhProps) {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const { isModalUpHinhOpen, infoUser } = useSelector(
    (state: RootState) => state.infoUserSlice
  );
  const loginData = useSelector(
    (state: RootState) => state.userSlice.loginData
  );
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();

  const normFile = (e: UploadChangeParam): UploadFile[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const hideModal = () => {
    dispatch(setIsModalUpHinhOpenAction(false));
  };

  const handleOk = (values: FormValues) => {
    const file = values.avatar?.[0]?.originFileObj as RcFile;
    if (!file) {
      message.error(t("message.error.chooseImage"));
      return;
    }

    const formData = new FormData();
    formData.append("formFile", file, file.name);

    if (!token || !loginData) return;

    nguoiDungServices
      .uploadHinhUser(formData, token)
      .then((result) => {
        console.log("Upload avatar response:", result);
        const avatar = result.data.content.avatar;

        const userClone = {
          ...loginData.user,
          avatar,
          password: "",
        };
        const loginClone = { ...loginData, user: userClone };
        localStorage.setItem("USER_LOGIN", JSON.stringify(loginClone));
        dispatch(fetchInfoUserAction(idUser));
        dispatch(setLoginData(loginClone));
        message.success(t("message.success.update"));
      })
      .catch((err) => {
        console.error(err);
        message.error(t("message.error.update"));
      });
  };

  return (
    <div>
      <Modal
        closable={false}
        open={isModalUpHinhOpen}
        okText={t("updateImage.button.update")}
        cancelText={t("updateImage.button.cancel")}
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
        <h1 className="my-3 text-2xl text-center">{t("updateImage.title")}</h1>
        <div>
          <img
            src={
              infoUser?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            }
            alt="avatar"
            className="mx-auto h-36 w-36 object-cover rounded-full"
          />
        </div>

        <Form.Item
          label=""
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          style={{ textAlign: "center", marginTop: "20px" }}
          rules={[
            {
              required: true,
              message: t("updateImage.form.chooseImage"),
            },
          ]}
          hasFeedback
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg"
            customRequest={({ onSuccess }) => {
              if (onSuccess) setTimeout(() => onSuccess("ok"), 0);
            }}
          >
            <button className="button-primary" type="button">
              <PlusOutlined />
            </button>
          </Upload>
        </Form.Item>
      </Modal>
    </div>
  );
}
