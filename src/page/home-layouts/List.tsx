import { useEffect, useState } from "react";
import { Card } from "antd";
import { viTriServices } from "../../services/viTriServices";
import { useNavigate } from "react-router-dom";
import type { ViTri } from "../../types/ViTri";

export default function List() {
  const [vitriArr, setVitriArr] = useState<ViTri[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    viTriServices
      .findViTri("", 1, 8)
      .then((res) => {
        if (res.data.content.data.length > 0) {
          setVitriArr(res.data.content.data as ViTri[]);
        } else {
          console.error("Không có dữ liệu.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, []);

  const handleNavigation = (id: number) => {
    navigate(`/rooms/${id}`);
  };

  const renderVitriList = () => {
    if (vitriArr.length === 0) {
      return (
        <p className="text-center text-gray-500">Không có dữ liệu hiển thị.</p>
      );
    }

    return vitriArr.map((vitri) => (
      <Card
        data-aos="zoom-in-up"
        key={vitri.id}
        hoverable
        onClick={() => handleNavigation(vitri.id)}
        className="flex flex-row items-center gap-0 rounded-lg shadow-md p-1 bg-white cursor-pointer"
      >
        <div className="flex gap-3">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              className="w-full h-full object-cover rounded-md"
              src={vitri.hinhAnh}
              alt={vitri.tinhThanh}
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-gray-900">{vitri.tinhThanh}</p>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-4">
      <div
        id="listSection"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {renderVitriList()}
      </div>
    </div>
  );
}
