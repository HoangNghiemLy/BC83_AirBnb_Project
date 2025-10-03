import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalPaymentOpen } from "../../store/slices/bookingSlice";
import { DatePicker, Form, Input, Modal, Radio, Space, Tabs } from "antd";
import dayjs from "dayjs";
// import type { DatePickerProps } from "antd";
import type { TabsProps } from "antd";
import type { RadioChangeEvent } from "antd";
import type { RootState } from "../../store/store"; // Sửa path nếu store nằm khác chỗ
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useTranslation } from "react-i18next";

type ModalPaymentProps = {
  bookingAction: () => void;
};
type PaymentOnlineForm = {
  soThe1: string;
  soThe2: string;
  soThe3: string;
  soThe4: string;
  maThe: string;
  HSD: string; // hoặc `dayjs.Dayjs` nếu bạn dùng DatePicker
  chuThe: string;
};

const ModalPayment: React.FC<ModalPaymentProps> = ({ bookingAction }) => {
  const { isModalPaymentOpen, tienTruocThue } = useSelector(
    (state: RootState) => state.bookingSlice
  );

  const [value, setValue] = useState<"online" | "offline">("online");
  const [activeTab, setActiveTab] = useState("1");
  const [optionTab1, setOptionTab] = useState<"online" | "offline">("online");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const handleCancel = () => {
    dispatch(setIsModalPaymentOpen(false));
  };

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    const selected = e.target.value as "online" | "offline";
    setValue(selected);
    setOptionTab(selected);
  };

  const onFinish = (values: PaymentOnlineForm) => {
    console.log(values);
    bookingAction();
  };

  const onFinishFailed = (
    errorInfo: ValidateErrorEntity<PaymentOnlineForm>
  ) => {
    console.error(errorInfo);
  };

  const renderContentTab1 = () => (
    <div>
      <Radio.Group onChange={onChangeRadio} value={value}>
        <Space direction="vertical">
          <Radio value="online">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>{t("modalPayment.radio.online")}</p>
              <div>
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amazon-pay"></i>
                <i className="fa fa-credit-card"></i>
              </div>
            </div>
          </Radio>
          <Radio value="offline">
            <div className="grid grid-cols-1 md:flex justify-center items-center gap-3 text-xl">
              <p>{t("modalPayment.radio.offline")}</p>
              <div>
                <i className="fa fa-money-bill"></i>
              </div>
            </div>
          </Radio>
        </Space>
      </Radio.Group>
      <div className="w-full mt-5">
        <button className="button-primary" onClick={() => setActiveTab("2")}>
          {t("modalPayment.button.next")}
        </button>
      </div>
    </div>
  );

  const renderContentTab2 = () => {
    if (optionTab1 === "online") {
      return (
        <Form
          name="paymentForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          {/* Card Number Input */}
          <Form.Item label={t("modalPayment.form.cardNumber")}>
            <Space>
              {["soThe1", "soThe2", "soThe3", "soThe4"].map((name) => (
                <Form.Item
                  key={name}
                  name={name}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t("modalPayment.form.cardNumberError"),
                    },
                    {
                      pattern: /^\d{4}$/,
                      message: t("modalPayment.form.cardNumberPattern"),
                    },
                  ]}
                  noStyle={false}
                >
                  <Input maxLength={4} placeholder="XXXX" inputMode="numeric" />
                </Form.Item>
              ))}
            </Space>
          </Form.Item>

          {/* CVV Input */}
          <Form.Item
            label={t("modalPayment.form.cvv")}
            name="maThe"
            hasFeedback
            rules={[
              {
                required: true,
                message: t("modalPayment.form.cvvRequired"),
              },
              {
                pattern: /^\d{3,4}$/, // Often CVV can be 3 or 4 digits
                message: t("modalPayment.form.cvvPattern"), // Specific message for pattern
              },
            ]}
          >
            <Input
              maxLength={4} // Max length for CVV
              placeholder="CVV"
              inputMode="numeric"
            />
          </Form.Item>

          {/* Expiry Date Input */}
          <Form.Item
            label={t("modalPayment.form.expiry")}
            name="HSD"
            hasFeedback
            rules={[
              {
                required: true,
                message: t("modalPayment.form.expiryRequired"),
              },
            ]}
          >
            <DatePicker
              format="MM/YYYY"
              picker="month"
              minDate={dayjs()}
              placeholder={t("modalPayment.form.expiryPlaceholder")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Cardholder Name Input */}
          <Form.Item
            label={t("modalPayment.form.cardholder")}
            name="chuThe"
            rules={[
              {
                required: true,
                message: t("modalPayment.form.cardholderRequired"),
              },
              {
                pattern: /^[a-zA-Z\s.'-]+$/, // More comprehensive pattern for names
                message: t("modalPayment.form.cardholderPattern"),
              },
            ]}
          >
            <Input placeholder={t("modalPayment.form.cardholderPlaceholder")} />
          </Form.Item>

          {/* Form Action Buttons */}
          <div className="flex justify-between mt-5">
            <button
              className="button-outline-primary"
              onClick={() => setActiveTab("1")}
              type="button"
            >
              {t("modalPayment.button.back")}
            </button>
            <button className="button-primary" type="submit">
              {t("modalPayment.title")}
            </button>
          </div>
        </Form>
      );
    }

    return (
      <div>
        <p>
          {t("modalPayment.cash.amount")}{" "}
          <span className="font-bold">{tienTruocThue} $</span>
        </p>
        <div className="flex justify-between mt-5">
          <button
            className="button-outline-primary"
            onClick={() => setActiveTab("1")}
          >
            {t("modalPayment.button.back")}
          </button>
          <button className="button-primary" onClick={bookingAction}>
            {t("modalPayment.button.submit")}
          </button>
        </div>
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("modalPayment.tab1.title"),
      children: renderContentTab1(),
    },
    {
      key: "2",
      label: t("modalPayment.tab2.title"),
      children: renderContentTab2(),
    },
  ];

  return (
    <Modal
      open={isModalPaymentOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs activeKey={activeTab} items={items} onChange={onChange} />
    </Modal>
  );
};

export default ModalPayment;
