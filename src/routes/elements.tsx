import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import HomeLayout from "../page/home-layouts/HomeLayout";
import Homepage from "../page/home-layouts/Homepage";
import RoomsVitri from "../page/RoomsPage/RoomsVitri";
import RoomsPage from "../page/RoomsPage/RoomsPage";
import RoomDetailPage from "../page/RoomsDetailPage/RoomDetailPage";
import InfoUserPage from "../components/layouts/InfoUserPage/InfoUserPage";

import OAuthCallback from "../page/TempLoginPage/OAuthCallback";
import NotFoundPage from "../components/layouts/NotFoundPage/NotFoundPage";
import AdminLayout from "../components/layouts/AdminLayout/AdminLayout";
import QuanLyNguoiDungPage from "../page/QuanLyNguoiDungPage/QuanLyNguoiDungPage";
import QuanLyViTriPage from "../page/QuanLyViTriPage/QuanLyViTriPage";
import QuanLyPhongPage from "../page/QuanLyPhongPage/QuanLyPhongPage";
import QuanLyBookingPage from "../page/QuanLyBookingPage/QuanLyBookingPage";
import QuanLyChart from "../page/Chart/QuanLyChart";

export default function useRouterElements() {
  const elements = useRoutes([
    {
      path: PATH.ADMIN_MANAGEMENT_USER,
      element: <AdminLayout content={<QuanLyNguoiDungPage />} />,
    },
    {
      path: PATH.ADMIN_MANAGEMENT_LOCAL,
      element: <AdminLayout content={<QuanLyViTriPage />} />,
    },
    {
      path: PATH.ADMIN_MANAGEMENT_ROOM,
      element: <AdminLayout content={<QuanLyPhongPage />} />,
    },
    {
      path: PATH.ADMIN_MANAGEMENT_BOOKING,
      element: <AdminLayout content={<QuanLyBookingPage />} />,
    },
    {
      path: PATH.ADMIN_MANAGEMENT_CHART,
      element: <AdminLayout content={<QuanLyChart />} />,
    },
    {
      path: PATH.HOME,
      element: (
        <HomeLayout>
          <Homepage />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.ROOM}/:id`,
      element: (
        <HomeLayout>
          <RoomsVitri />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.ROOM_DETAIL}/:id`,
      element: (
        <HomeLayout>
          <RoomDetailPage />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.ROOM}`,
      element: (
        <HomeLayout>
          <RoomsPage />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.LOGIN_GOOGLE}`,
      element: (
        <HomeLayout>
          <OAuthCallback />
        </HomeLayout>
      ),
    },
    {
      path: `${PATH.PROFILE}`,
      element: (
        <HomeLayout>
          <InfoUserPage />
        </HomeLayout>
      ),
    },

    {
      path: PATH.NOT_FOUND,
      element: (
        <div>
          <NotFoundPage />
        </div>
      ),
    },
  ]);
  return elements;
}
