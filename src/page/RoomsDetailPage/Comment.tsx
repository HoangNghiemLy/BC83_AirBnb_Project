import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Rate, Select, App as AntdApp } from "antd";
import dayjs from "dayjs";
import { fetchListCommentByIdRoomAction } from "../../store/thunks/detailRoomThunks";
import { binhLuanServices } from "../../services/binhLuanServices";
import { setListCommentAction } from "../../store/slices/detailRoomSlice";
import type { AppDispatch, RootState } from "../../store/store";
import type {
  CommentFormValues,
  CommentItem,
  CommentProps,
} from "../../types/Comment";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
export default function Comment({ idRoom }: CommentProps) {
  const { message } = AntdApp.useApp();
  const { listComment } = useSelector(
    (state: RootState) => state.detailRoomSlice
  );
  const { isBooked } = useSelector((state: RootState) => state.bookingSlice);
  const loginData = useSelector(
    (state: RootState) => state.userSlice.loginData
  );
  //   const token = loginData?.token || "";
  const user = loginData?.user;
  const { t } = useTranslation();
  const { TextArea } = Input;
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (idRoom) {
      setIsLoading(true);
      dispatch(fetchListCommentByIdRoomAction(idRoom)).finally(() =>
        setIsLoading(false)
      );
    }
  }, [dispatch, idRoom]);

  const onFinish = (values: CommentFormValues) => {
    if (!user) return;

    const valuesClone = {
      ...values,
      maPhong: idRoom,
      maNguoiBinhLuan: user.id,
      ngayBinhLuan: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    binhLuanServices
      .addComment(valuesClone)
      .then(() => {
        dispatch(fetchListCommentByIdRoomAction(idRoom));
        message.success(t("message.success.comment"));
        form.resetFields();
      })
      .catch((err: unknown) => {
        message.error(t("message.error.comment"));
        if (err instanceof Error) {
          console.error(err.message);
        }
      });
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.error("Failed:", errorInfo);
  };

  const renderListComment = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin tip={t("comment.loading")} size="large" />
        </div>
      );
    }

    if (listComment.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500 italic">{t("comment.notComment")}</p>
        </div>
      );
    }

    // Sắp xếp từ mới nhất đến cũ nhất
    const sortedComments = [...listComment].sort((a, b) => {
      return (
        new Date(b.ngayBinhLuan).getTime() - new Date(a.ngayBinhLuan).getTime()
      );
    });

    return sortedComments.map((item: CommentItem) => (
      <div key={item.id}>
        <div className="flex items-center gap-3">
          <div>
            <img
              src={
                item.avatar ||
                "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              }
              alt="avatar"
              className="mx-auto h-12 w-12 object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{item.tenNguoiBinhLuan}</h1>
              <Rate
                disabled
                defaultValue={item.saoBinhLuan}
                className="bg-white bg-rate custom-rate"
              />
            </div>
            <p className="text-sm text-gray-500">
              {dayjs(item.ngayBinhLuan).format("DD-MM-YY hh:mm")}
            </p>
          </div>
        </div>
        <p className="mt-3">{item.noiDung}</p>
      </div>
    ));
  };

  const handleSortListComment = (order: string, key: keyof CommentItem) => {
    const listCommentClone = [...listComment];
    if (order === "newest" || order === "highest") {
      listCommentClone.sort((a, b) => (b[key] as number) - (a[key] as number));
    } else if (order === "oldest" || order === "lowest") {
      listCommentClone.sort((a, b) => (a[key] as number) - (b[key] as number));
    }
    dispatch(setListCommentAction(listCommentClone));
  };

  const handleSelectChange = (value: string) => {
    switch (value) {
      case "newest":
        handleSortListComment("newest", "id");
        break;
      case "oldest":
        handleSortListComment("oldest", "id");
        break;
      case "highest":
        handleSortListComment("highest", "saoBinhLuan");
        break;
      case "lowest":
        handleSortListComment("lowest", "saoBinhLuan");
        break;
      default:
        break;
    }
  };

  return (
    <div className="py-5 divide-y-2">
      {isBooked ? (
        <div>
          <div className="flex gap-3 items-center">
            <div>
              <img
                src={
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                }
                alt="avatar"
                className="h-12 w-12 object-cover rounded-full"
              />
            </div>
            <h1 className="text-lg font-bold">{user?.name}</h1>
          </div>

          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="saoBinhLuan"
              rules={[{ required: true, message: t("comment.chooseStart") }]}
            >
              <Rate className="bg-white bg-rate custom-rate" />
            </Form.Item>

            <Form.Item
              name="noiDung"
              rules={[{ required: true, message: t("comment.noComment") }]}
            >
              <TextArea
                className=""
                placeholder={t("comment.writeComment")}
                style={{
                  height: 80,
                }}
              />
            </Form.Item>

            <Form.Item>
              <button className="button-primary " type="submit">
                {t("comment.button")}
              </button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="mb-5 border-b-2 border-gray-300">
          <p className="text-primary">{t("comment.title")}</p>
        </div>
      )}

      <div className="py-5">
        <h1 className="text-xl font-bold mb-3">{t("comment.comment")}</h1>
        <Select
          options={[
            { value: "newest", label: t("comment.newest") },
            { value: "oldest", label: t("comment.oldest") },
            { value: "highest", label: t("comment.highest") },
            { value: "lowest", label: t("comment.lowest") },
          ]}
          className="w-28 my-5"
          onChange={handleSelectChange}
          placeholder={t("comment.arrange")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-80 overflow-y-scroll mt-3 ">
          {renderListComment()}
        </div>
      </div>
    </div>
  );
}
