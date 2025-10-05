import { Form, Input, DatePicker, Select, Button, App as AntdApp } from "antd";
import { authServices } from "../../services/authServices";
import dayjs from "dayjs";
import { setModalContent } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import type {
  FormValues,
  RegisterRequest,
  TempFormRegisterProps,
} from "../../types/auth";
import type { Dispatch } from "redux";
import { useTranslation } from "react-i18next";

export default function TempFormRegister({
  onRegisterSuccess,
}: TempFormRegisterProps) {
  const { message } = AntdApp.useApp();
  const dispatch: Dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleSubmit = async (values: FormValues) => {
    const { name, email, password, phone, birthday, gender } = values;
    const genderValue: boolean | null =
      gender === "male" ? true : gender === "female" ? false : null;

    const registerData: RegisterRequest = {
      id: 0,
      name,
      email,
      password,
      phone,
      birthday: birthday.format("YYYY-MM-DD"),
      gender: genderValue as boolean,
      role: "user",
    };

    try {
      await authServices.register(registerData);
      message.success(t("message.success.regester"));
      form.resetFields();
      dispatch(setModalContent("login"));
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error: any) {
      console.log("Đăng ký lỗi: ", error);
      message.error(t("message.error.regester"));
      message.error(error?.response?.data.content);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Đăng ký tài khoản Airbnb
      </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          {/* Tên */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Họ và tên</span>
            }
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input
              placeholder="Điền tên vào đây..."
              className="rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label={<span className="font-semibold text-gray-700">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Điền email vào đây..."
              className="rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
            />
          </Form.Item>

          {/* Mật khẩu */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Mật khẩu</span>
            }
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              {
                pattern: /[a-zA-Z]/,
                message: "Mật khẩu phải chứa ít nhất một chữ cái!",
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              className="rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Số điện thoại</span>
            }
            required
          >
            <Input.Group compact>
              <Form.Item
                name="countryCode"
                noStyle
                rules={[{ required: true, message: "Chọn mã vùng!" }]}
              >
                <Select
                  className="rounded-l-lg"
                  placeholder="Mã vùng"
                  style={{ width: "30%" }}
                >
                  <Select.Option value="+84">+84 (Vietnam)</Select.Option>
                  <Select.Option value="+44">+44 (UK)</Select.Option>
                  <Select.Option value="+61">+61 (Australia)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                noStyle
                dependencies={["countryCode"]}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value)
                        return Promise.reject(
                          new Error("Vui lòng nhập số điện thoại!")
                        );
                      if (!/^0\d{9}$/.test(value))
                        return Promise.reject(
                          new Error(
                            "Số điện thoại phải bắt đầu bằng 0 và đủ 10 chữ số!"
                          )
                        );
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  style={{ width: "70%" }}
                  placeholder="Nhập số điện thoại"
                  maxLength={10}
                  className="rounded-r-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          {/* Ngày sinh & Giới tính */}
          <div className="flex gap-4">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700">Ngày sinh</span>
              }
              name="birthday"
              className="flex-1"
              rules={[{ required: true, message: "Chọn ngày sinh!" }]}
            >
              <DatePicker
                className="w-full rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                placeholder="Chọn ngày sinh"
                maxDate={dayjs(new Date())}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700">Giới tính</span>
              }
              name="gender"
              className="flex-1"
              rules={[{ required: true, message: "Chọn giới tính!" }]}
            >
              <Select
                className="rounded-lg"
                placeholder="Chọn giới tính"
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ]}
              />
            </Form.Item>
          </div>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-primary hover:opacity-90 text-white font-semibold h-12 rounded-lg shadow-lg transition-all duration-300"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
    </div>
  );
}
