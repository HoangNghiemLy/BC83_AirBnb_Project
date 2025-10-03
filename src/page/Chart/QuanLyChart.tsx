import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import { phongServices } from "../../services/phongServices";
import { bookingServices } from "../../services/bookingServices";
import { viTriServices } from "../../services/viTriServices";
import dayjs from "dayjs";
import { FaUsers, FaBed, FaCalendarCheck, FaMapMarkedAlt } from "react-icons/fa";


interface RoomChartData {
  name: string;
  total: number;
}

interface BookingChartData {
  month: string;
  total: number;
}

interface LocationChartData {
  district: string;
  total: number;
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const DashboardCharts: React.FC = () => {
  const [totalAllUsers, setTotalAllUsers] = useState<number>(0);

  const [roomChartData, setRoomChartData] = useState<RoomChartData[]>([]);
  const [totalAllRooms, setTotalAllRooms] = useState<number>(0);

  const [bookingChartData, setBookingChartData] = useState<BookingChartData[]>(
    []
  );
  const [totalAllBookings, setTotalAllBookings] = useState<number>(0);

  const [locationChartData, setLocationChartData] = useState<
    LocationChartData[]
  >([]);
  const [totalAllLocations, setTotalAllLocations] = useState<number>(0);

  // ===== Tổng User =====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await nguoiDungServices.getListUserAdmin();
        const users = res.data.content || [];
        setTotalAllUsers(users.length);
      } catch (err) {
        console.error("Lỗi tải dữ liệu user:", err);
      }
    };
    fetchUsers();
  }, []);

  // ===== Phòng theo số phòng ngủ =====
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await phongServices.getListPhong();
        const rooms = res.content || [];
        setTotalAllRooms(rooms.length);

        const grouped: { [key: string]: number } = {};
        rooms.forEach((room) => {
          const key = `${room.phongNgu || 0} phòng ngủ`;
          grouped[key] = (grouped[key] || 0) + 1;
        });

        const formatted = Object.entries(grouped).map(([name, total]) => ({
          name,
          total,
        }));

        setRoomChartData(formatted);
      } catch (err) {
        console.error("Lỗi tải dữ liệu phòng:", err);
      }
    };

    fetchRooms();
  }, []);

  // ===== Booking theo tháng =====
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingServices.getListBooking();
        const bookings = res.data.content || [];
        setTotalAllBookings(bookings.length);

        const grouped: { [key: string]: number } = {};
        bookings.forEach((booking) => {
          const month = dayjs(booking.ngayDi).format("MM/YYYY");
          grouped[month] = (grouped[month] || 0) + 1;
        });

        const formatted = Object.entries(grouped)
          .map(([month, total]) => ({ month, total }))
          .sort(
            (a, b) =>
              dayjs(a.month, "MM/YYYY").toDate().getTime() -
              dayjs(b.month, "MM/YYYY").toDate().getTime()
          );

        setBookingChartData(formatted);
      } catch (err) {
        console.error("Lỗi tải dữ liệu booking:", err);
      }
    };

    fetchBookings();
  }, []);

  // ===== Vị trí theo Tỉnh =====
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await viTriServices.getListViTri();
        const locations = res.data.content || [];
        setTotalAllLocations(locations.length);

        const grouped: { [key: string]: number } = {};
        locations.forEach((loc) => {
          const province = loc.tinhThanh || "Không xác định";
          grouped[province] = (grouped[province] || 0) + 1;
        });

        const formatted = Object.entries(grouped).map(([province, total]) => ({
          district: province,
          total,
        }));

        setLocationChartData(formatted);
      } catch (err) {
        console.error("Lỗi tải dữ liệu vị trí:", err);
      }
    };

    fetchLocations();
  }, []);

  const renderBarChart = (
    title: string,
    subtitle: string,
    data: any[],
    dataKey: string,
    xKey: string
  ) => (
    <div
      style={{
        width: "100%",
        height: 450,
        marginBottom: 50,
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
        {title}
      </h3>
      <p style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
        {subtitle}
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
          <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
          <Tooltip />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} barSize={45}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey={dataKey}
              position="top"
              style={{ fontSize: 12, fontWeight: "bold", fill: "#111" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ width: "100%", padding: "20px", background: "#f3f4f6" }}>
      {/* Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#3B82F6,#2563EB)",
            color: "#fff",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaUsers size={32} />
          <div>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>Người dùng</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
              {totalAllUsers}
            </h2>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#10B981,#059669)",
            color: "#fff",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaCalendarCheck size={32} />
          <div>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>Booking</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
              {totalAllBookings}
            </h2>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
            color: "#fff",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaBed size={32} />
          <div>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>Phòng</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
              {totalAllRooms}
            </h2>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#F59E0B,#D97706)",
            color: "#fff",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FaMapMarkedAlt size={32} />
          <div>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>Vị trí</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
              {totalAllLocations}
            </h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      {renderBarChart("Biểu đồ số phòng theo số phòng ngủ", "Tổng số phòng", roomChartData, "total", "name")}
      {renderBarChart("Biểu đồ đặt phòng theo tháng", "Tổng số đặt phòng", bookingChartData, "total", "month")}
      {renderBarChart("Biểu đồ vị trí số phòng theo tỉnh/thành phố", "Tổng số vị trí", locationChartData, "total", "district")}
    </div>
  );
};

export default DashboardCharts;
