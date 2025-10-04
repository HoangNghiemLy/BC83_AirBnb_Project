import React from "react";
import { Button, Form, Input, Card, App as AntdApp } from "antd";
import { authServices } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { setLoginData, setModalContent } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { getListIdBookingAction } from "../../store/thunks/bookingThunks";
import type { FormProps } from "antd";
import type { LoginRequest } from "../../types/auth";
import type { AppDispatch } from "../../store/store";
import type { TempFormLoginProps } from "../../types";
import { useTranslation } from "react-i18next";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const TempFormLogin: React.FC<TempFormLoginProps> = ({ onLoginSuccess }) => {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const onFinish: FormProps<LoginRequest>["onFinish"] = async (values) => {
    try {
      const result = await authServices.login(values);
      const { user, token } = result.content;
      const normalizedUser = { ...user, avatar: user.avatar ?? undefined };
      const userData = { user: normalizedUser, token };

      dispatch(setLoginData(userData));
      localStorage.setItem("USER_LOGIN", JSON.stringify(userData));
      dispatch(getListIdBookingAction(user.id));

      if (onLoginSuccess) onLoginSuccess();
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      message.error(t("message.error.login"));
    }
  };

  const onFinishFailed: FormProps<LoginRequest>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.error("Form validation failed:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <Card
        className="w-full max-w-md shadow-2xl rounded-2xl"
        bodyStyle={{ padding: "2rem" }}
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-primary">
          {t("menu.login")} Airbnb
        </h2>
        <p className="text-center text-gray-500 mb-6"></p>

        <Form
          layout="vertical"
          name="loginForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{ email: "", password: "" }}
        >
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: t("menu.messTK") }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder={t("menu.plTaikhoan")}
              className="rounded-md py-2"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={t("menu.password")}
            name="password"
            rules={[{ required: true, message: t("menu.messMK") }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={t("menu.plMatkhau")}
              className="rounded-md py-2"
            />
          </Form.Item>

          {/* Buttons */}
          <div className="flex justify-between mt-6 gap-4">
            <Button
              size="large"
              className="flex-1 border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white font-semibold px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => dispatch(setModalContent("register"))}
            >
              {t("menu.regester")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="flex-1 bg-gradient-to-r from-primary to-pink-600 border-none text-white font-semibold px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("menu.login")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TempFormLogin;
