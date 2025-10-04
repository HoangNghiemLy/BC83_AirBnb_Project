import { useEffect } from "react";
import { Table, Avatar, Tag, Popconfirm } from "antd";
import { DeleteOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
} from "../../store/slices/quanLyNguoiDungSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../../store/thunks/quanLyNguoiDungThunks";
import type { RootState, AppDispatch } from "../../store/store";
import type { ColumnsType } from "antd/es/table";
import type { User } from "../../types/User";
import type { ReactElement } from "react";
import { App as AntdApp } from "antd";
import { useState } from "react";
interface ListUserProps {
  valueInput: string;
}

export default function ListUser({ valueInput }: ListUserProps): ReactElement {
  const { listUser, totalRow, currentPage } = useSelector(
    (state: RootState) => state.quanLyNguoiDungSlice
  );
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchListUserAction({ currentPage, valueInput, pageSize }));
  }, [currentPage, dispatch, valueInput, pageSize]);

  const handlePageChange = (pageIndex: number, newPageSize?: number): void => {
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      dispatch(setCurrentPageAction(1)); // reset về trang đầu
    } else {
      dispatch(setCurrentPageAction(pageIndex));
    }
  };

  const handleDeleteUser = async (id: number): Promise<void> => {
    try {
      await nguoiDungServices.deleteUser(id);
      message.success("Xoá thành công");
      dispatch(fetchListUserAction({ currentPage, valueInput }));
    } catch (error) {
      console.error(error);
      message.error("Xoá thất bại");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_, record) => (
        <div className="md:flex items-center">
          {record.avatar ? (
            <Avatar
              className="mr-2 h-8 w-8"
              src={<img src={record.avatar} alt="avatar" />}
            />
          ) : (
            <Avatar icon={<UserOutlined />} className="mr-2 h-8 w-8" />
          )}
          <p className="truncate">{record.name}</p>
        </div>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value: string) => <p className="underline truncate">{value}</p>,
    },
    {
      title: "Người dùng",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "ADMIN" ? (
          <Tag color="red">ADMIN</Tag>
        ) : (
          <Tag color="green">USER</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <div>
          <ToolOutlined
            onClick={() => {
              dispatch(fetchUserInfoAction(record.id))
                .then(() => {
                  dispatch(setIsModalEditOpenAction(true));
                })
                .catch((err) => console.error(err));
            }}
            className="text-2xl hover:cursor-pointer mr-2"
          />
          <Popconfirm
            title="Xoá người dùng"
            description="Bạn có chắc muốn xoá người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-2xl hover:cursor-pointer" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={listUser.map((user) => ({ ...user, key: user.id }))}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow || 0,
        current: currentPage,
        pageSize: pageSize,
        showSizeChanger: true,
        onChange: handlePageChange,
      }}
    />
  );
}
