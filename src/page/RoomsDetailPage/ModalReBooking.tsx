import React from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} from "../../store/slices/bookingSlice";
import type { RootState } from "../../store/store";
import { useTranslation } from "react-i18next";

const ModalReBooking: React.FC = () => {
  const dispatch = useDispatch();
  const { isModalReBookingOpen } = useSelector(
    (state: RootState) => state.bookingSlice
  );
  const { t } = useTranslation();
  const handleOk = () => {
    dispatch(setIsModalReBookingOpen(false));
    dispatch(setIsModalPaymentOpen(true));
  };

  const handleCancel = () => {
    dispatch(setIsModalReBookingOpen(false));
  };

  return (
    <Modal
      title={t("modalReBooking.title")}
      okText={t("modalReBooking.okText")}
      cancelText={t("modalReBooking.cancelText")}
      open={isModalReBookingOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{t("modalReBooking.message")}</p>
    </Modal>
  );
};

export default ModalReBooking;
