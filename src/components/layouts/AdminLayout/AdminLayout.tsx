import type { ReactNode } from "react";

import { useSelector } from "react-redux";
import { Modal } from "antd";
import type { RootState } from "../../../store/store";
import Slider from "../Sider/Slider";

interface AdminLayoutProps {
  content: ReactNode;
}

export default function AdminLayout({ content }: AdminLayoutProps) {
  const loginData = useSelector(
    (state: RootState) => state.userSlice.loginData
  );

  const renderLayout = () => {
    if (loginData?.user.role !== "ADMIN") {
      return (
        <Modal open={true} maskClosable={false} footer={null} closable={false}>
          <div className="space-y-5">
            <p className="text-center text-2xl">Bạn không phải admin</p>
            <div className="flex justify-center">
              <button
                className="button-primary"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Trở về trang chủ
              </button>
            </div>
          </div>
        </Modal>
      );
    } else {
      return <Slider content={content} />;
    }
  };

  return <div>{renderLayout()}</div>;
}
