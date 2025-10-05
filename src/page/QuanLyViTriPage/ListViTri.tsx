import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
} from "../../store/slices/quanLyViTriSlice";
import { Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { viTriServices } from "../../services/viTriServices";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../../store/thunks/quanLyViTriThunks";

import type { ColumnsType } from "antd/es/table";
import type { AppDispatch, RootState } from "../../store/store";
import type { ViTri } from "../../types/ViTri";
import type { ReactElement } from "react";
import { App as AntdApp } from "antd";
interface ListViTriProps {
  valueInput: string;
}

export default function ListViTri({
  valueInput,
}: ListViTriProps): ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector(
    (state: RootState) => state.userSlice.loginData!
  );
  const { listViTri, totalRow, currentPage } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );
  const { message } = AntdApp.useApp();
  const [pageSize, setPageSize] = useState<number>(10);
  useEffect(() => {
    dispatch(fetchListViTriAction({ currentPage, valueInput, pageSize }));
  }, [dispatch, currentPage, valueInput, pageSize]);

  const handlePageChange = (pageIndex: number, newPageSize?: number): void => {
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize); // cập nhật pageSize mới
      dispatch(setCurrentPageAction(1)); // reset về trang đầu
    } else {
      dispatch(setCurrentPageAction(pageIndex));
    }
  };

  const handleDeleteViTri = (id: number): void => {
    viTriServices
      .deleteViTri(id, token)
      .then(() => {
        dispatch(fetchListViTriAction({ currentPage, valueInput }));
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      });
  };

  const confirm = (id: number): void => {
    handleDeleteViTri(id);
  };

  const columns: ColumnsType<ViTri> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "tenViTri",
      key: "tenViTri",
      render: (_, dataObject) => (
        <div className="md:flex items-center">
          <img
            src={dataObject.hinhAnh}
            alt="avatar"
            className="mr-2 w-36 h-16 object-cover"
          />
          <p>{dataObject.tenViTri}</p>
        </div>
      ),
    },
    {
      title: "Tỉnh thành",
      dataIndex: "tinhThanh",
      key: "tinhThanh",
    },
    {
      title: "Quốc gia",
      dataIndex: "quocGia",
      key: "quocGia",
      render: (_, dataObject) => (
        <p className="underline">{dataObject.quocGia}</p>
      ),
    },
    {
      title: "Thao tác",
      fixed: "right",
      key: "action",
      render: (_, dataObject) => (
        <div className="flex items-center gap-2">
          <EditOutlined
            onClick={() => {
              dispatch(fetchViTriInfoAction(dataObject.id))
                .then(() => {
                  dispatch(setIsModalEditOpenAction(true));
                })
                .catch((err) => {
                  console.error(err);
                });
            }}
            className="text-xl text-blue-600 hover:!text-blue-800 hover:bg-blue-50 hover:cursor-pointer transition-all duration-200 p-1 rounded"
          />
          <Popconfirm
            title="Xoá vị trí"
            description="Bạn có chắc muốn xóa vị trí này?"
            onConfirm={() => confirm(dataObject.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <DeleteOutlined className="text-xl text-red-600 hover:!text-red-800 hover:bg-red-50 hover:cursor-pointer transition-all duration-200 p-1 rounded" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const renderListVitri = (): ViTri[] =>
    listViTri.map((viTri) => ({
      key: viTri.id,
      id: viTri.id,
      tenViTri: viTri.tenViTri,
      tinhThanh: viTri.tinhThanh,
      quocGia: viTri.quocGia,
      hinhAnh: viTri.hinhAnh,
    }));

  return (
    <Table
      dataSource={renderListVitri()}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow ?? undefined,
        current: currentPage,
        pageSize: pageSize,
        showSizeChanger: true,
        onChange: handlePageChange,
      }}
    />
  );
}
