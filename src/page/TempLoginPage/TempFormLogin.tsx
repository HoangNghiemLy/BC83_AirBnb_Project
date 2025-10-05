import React from "react";
import { Button, Form, Input, App as AntdApp } from "antd";
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

      message.success("Đăng nhập thành công!");
      
      if (onLoginSuccess) onLoginSuccess();
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        {t("menu.login")} Airbnb
      </h2>

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
            label={<span className="font-semibold text-gray-700">Email</span>}
            name="email"
            rules={[{ required: true, message: t("menu.messTK") }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder={t("menu.plTaikhoan")}
              className="rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span className="font-semibold text-gray-700">{t("menu.password")}</span>}
            name="password"
            rules={[{ required: true, message: t("menu.messMK") }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={t("menu.plMatkhau")}
              className="rounded-lg px-4 py-2 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-primary hover:opacity-90 text-white font-semibold h-12 rounded-lg shadow-lg transition-all duration-300"
            >
              {t("menu.login")}
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">Chưa có tài khoản? </span>
          <Button
            type="link"
            className="p-0 h-auto text-primary font-medium hover:text-pink-600"
            onClick={() => dispatch(setModalContent("register"))}
          >
            {t("menu.regester")}
          </Button>
        </div>
    </div>
  );
};

export default TempFormLogin;
