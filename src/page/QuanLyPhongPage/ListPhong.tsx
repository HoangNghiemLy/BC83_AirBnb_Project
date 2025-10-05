import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { App as AntdApp, Popconfirm, Popover, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { phongServices } from "../../services/phongServices";
import {
  setCurrentPageAction,
  setIsModalEditOpenAction,
  setListPhongAction,
} from "../../store/slices/quanLyPhongSlice";
import { viTriServices } from "../../services/viTriServices";
import { setListViTriAction } from "../../store/slices/quanLyViTriSlice";
import type { RootState, AppDispatch } from "../../store/store";

import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../../store/thunks/quanLyPhongThunks";
import type { ViTri } from "../../types/ViTri";
import type { Phong } from "../../types/Phong";
import type { ColumnsType } from "antd/es/table";

interface ListPhongProps {
  valueInput: string;
}
export interface PhongTableItem {
  key: number;
  id: number;
  tenPhong: string;
  moTa: string;
  tinhThanh: string;
  hinhAnh: string;
}

export default function ListPhong({ valueInput }: ListPhongProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = AntdApp.useApp();
  const [pageSize, setPageSize] = useState<number>(10);
  const token = useSelector(
    (state: RootState) => state.userSlice.loginData?.token
  );
  const { listPhong, totalRow, currentPage } = useSelector(
    (state: RootState) => state.quanLyPhongSlice
  );
  console.log("listPhong: ", listPhong);
  const { listViTri } = useSelector(
    (state: RootState) => state.quanLyViTriSlice
  );

  useEffect(() => {
    if (currentPage !== undefined) {
      dispatch(fetchListPhongAction({ currentPage, valueInput, pageSize }));
    }
    viTriServices
      .getListViTri()
      .then((result) => {
        dispatch(setListViTriAction(result.data.content));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [dispatch, currentPage, valueInput, pageSize]);

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    dispatch(setCurrentPageAction(pageIndex));
    phongServices
      .findPhongAdmin(pageIndex, pageSize, valueInput)
      .then((result) => {
        dispatch(setListPhongAction(result.data.content.data));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeletePhong = (id: number) => {
    if (!token) return;
    phongServices
      .deletePhong(id, token)
      .then(() => {
        dispatch(fetchListPhongAction({ currentPage, valueInput, pageSize }));
        message.success("Xóa thành công");
      })
      .catch((err) => {
        console.error(err);
        message.error("Xóa thất bại");
      });
  };

  const confirm = (id: number) => {
    handleDeletePhong(id);
  };

  const renderTinhThanh = (maViTri: number): string => {
    const viTri = listViTri.find((v: ViTri) => v.id === maViTri);
    return viTri?.tenViTri || "";
  };

  const renderListPhong = (): PhongTableItem[] => {
    if (!Array.isArray(listPhong)) return [];
    return listPhong.map((phong: Phong) => ({
      key: phong.id,
      id: phong.id,
      tenPhong: phong.tenPhong,
      moTa: phong.moTa,
      tinhThanh: renderTinhThanh(phong.maViTri),
      hinhAnh: phong.hinhAnh,
    }));
  };

  const columns: ColumnsType<PhongTableItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      render: (_, dataObject) => (
        <div className="md:flex items-center">
          <img
            src={dataObject.hinhAnh}
            alt="avatar"
            className="mr-2 w-36 h-16 object-cover"
          />
          <p>{dataObject.tenPhong}</p>
        </div>
      ),
    },
    {
      title: "Tỉnh thành",
      dataIndex: "tinhThanh",
      key: "tinhThanh",
    },
    {
      title: "Thông tin",
      dataIndex: "moTa",
      key: "moTa",
      render: (_, dataObject) => {
        const content = <p>{dataObject.moTa}</p>;
        return (
          <Popover content={content} title="Chi tiết">
            <p className="cursor-pointer underline">Chi tiết</p>
          </Popover>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, dataObject) => (
        <div className="flex items-center gap-2">
          <EditOutlined
            onClick={() => {
              dispatch(fetchPhongInfoAction(dataObject.id.toString()))
                .then(() => dispatch(setIsModalEditOpenAction(true)))
                .catch((err) => console.error(err));
            }}
            className="text-xl text-blue-600 hover:!text-blue-800 hover:bg-blue-50 hover:cursor-pointer transition-all duration-200 p-1 rounded"
          />
          <Popconfirm
            title="Xoá phòng"
            description="Bạn có chắc muốn xóa phòng?"
            onConfirm={() => confirm(dataObject.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              danger: true,
            }}
          >
            <DeleteOutlined className="text-xl text-red-600 hover:!text-red-800 hover:bg-red-50 hover:cursor-pointer transition-all duration-200 p-1 rounded" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table<PhongTableItem>
      dataSource={renderListPhong()}
      columns={columns}
      scroll={{ x: "max-content" }}
      pagination={{
        total: totalRow ?? 0,
        current: currentPage,
        pageSize,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"],
        onChange: handlePageChange,
        onShowSizeChange: (_, newPageSize) => {
          setPageSize(newPageSize);
          dispatch(setCurrentPageAction(1));
          dispatch(
            fetchListPhongAction({
              currentPage: 1,
              valueInput,
              pageSize: newPageSize,
            })
          );
        },
      }}
    />
  );
}
