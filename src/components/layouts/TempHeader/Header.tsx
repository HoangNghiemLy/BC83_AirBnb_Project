import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { App as AntdApp, Modal } from "antd";
import TempFormLogin from "../../../page/TempLoginPage/TempFormLogin";
import TempFormRegister from "../../../page/TempLoginPage/TempFormRegister";
import "@fortawesome/fontawesome-free/css/all.min.css";
import airbnbLogo from "../../../assets/image/logoAirbnb.png";
import {
  setIsModalOpen,
  setModalContent,
} from "../../../store/slices/userSlice";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";
import type { RootState, AppDispatch } from "../../../store/store";

import { useTranslation } from "react-i18next";

const TempHeader: React.FC = () => {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.userSlice.loginData);
  const { isModalOpen, modalContent } = useSelector(
    (state: RootState) => state.userSlice
  );
  const { themeMode } = useSelector((state: RootState) => state.darkModeSlice);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefMobi = useRef<HTMLDivElement>(null);
  const userIconRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const isRoomDetailPage = location.pathname.includes("/room-detail/");

  const handleLogout = () => {
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("LIST_ID_BOOKING");
    message.success(t("message.success.logout"));
    setTimeout(() => {
      setShowDropdown(false);
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowDropdown(false);
        setIsScrolled(true);
        setIsDropdownOpen(false);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }

      if (
        dropdownRefMobi.current &&
        !dropdownRefMobi.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRoomDetailPage]);

  const handleGohome = () => {
    window.location.href = "/";
  };

  const handleOpenModal = (content: "login" | "register") => {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  };

  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <header
      className={`${themeMode} fixed top-0 left-0 w-full z-35 transition-all duration-500 ${
        isScrolled || isRoomDetailPage
          ? "bg-white shadow-md h-20"
          : "bg-transparent h-22"
      } flex items-center pb-2`}
    >
      <div className="container flex justify-center md:justify-between items-center mx-auto">
        <a
          onClick={handleGohome}
          className="flex items-center text-2xl self-center px-8 font-bold cursor-pointer"
        >
          <img
            src={airbnbLogo}
            alt="Airbnb logo"
            className="w-10 h-8 object-contain mr-2"
          />
          <span className="text-3xl text-primary">airbnb</span>
        </a>

        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 font-normal transition cursor-pointer ${
                  isActive
                    ? "font-bold text-active"
                    : themeMode === "dark" || isScrolled || isRoomDetailPage
                    ? "custom-text-black"
                    : "custom-text-white"
                }`
              }
            >
              {t("menu.home")}
            </NavLink>
          </li>

          {[
            { label: t("menu.room"), link: "/rooms", section: null },
            {
              label: t("menu.list"),
              link: null,
              section: "listSection",
              showOnHome: true,
            },
            {
              label: t("menu.favourite"),
              link: null,
              section: "locationSection",
              showOnHome: true,
            },
            {
              label: t("menu.contact"),
              link: null,
              section: "contactSection",
            },
          ]
            .filter(({ showOnHome }) => {
              if (showOnHome && window.location.pathname !== "/") return false;
              return true;
            })
            .map(({ label, link, section }) => (
              <li key={label} className="flex">
                {link ? (
                  <NavLink
                    to={link}
                    className={({ isActive }) =>
                      `flex items-center px-3 font-normal transition cursor-pointer ${
                        isActive
                          ? "font-bold text-active" // Custom class for active state
                          : themeMode === "dark"
                          ? "custom-text-white"
                          : isScrolled || isRoomDetailPage
                          ? "custom-text-black"
                          : "custom-text-white"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ) : (
                  <a
                    onClick={() => handleScrollTo(section!)}
                    className={`flex items-center px-3 font-normal transition cursor-pointer ${
                      themeMode === "dark"
                        ? "custom-text-white "
                        : isScrolled || isRoomDetailPage
                        ? "custom-text-black "
                        : "custom-text-white "
                    }`}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
        </ul>

        <div className="gap-3 items-center flex-shrink-0 flex px-8 relative">
          <div className="flex-row items-center gap-2 hidden md:flex">
            <DarkLightToggle />

          </div>

          {user ? (
            <>
              <div
                ref={userIconRef}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-gray-800 text-white transition-all duration-300 ${
                  showDropdown ? "ring-4 ring-red-400" : "ring-2 ring-gray-300"
                } hover:ring-4 hover:ring-red-400`}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.user.avatar ? (
                  <img
                    src={user.user.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-xl"></i>
                )}
              </div>
              <div className="relative group cursor-pointer">
                <p className="hidden md:block text-primary text-base uppercase truncate max-w-[70px]">
                  {user.user.name}
                </p>
                <span className="absolute left-0 top-full mt-2 w-max uppercase bg-white text-primary text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {user.user.name}
                </span>
              </div>

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 bg-white shadow-md rounded-lg overflow-hidden divide-y-2 space-y-2"
                  style={{
                    zIndex: 1000,
                    width: "250px",
                    top: "calc(100% + 8px)",
                  }}
                >
                  <ul className="border-b-1 border-gray-300">
                    <li className="px-4 py-2 text-black">{user.user.name}</li>
                    <li className="px-4 truncate text-gray-500">
                      {user.user.email}
                    </li>
                  </ul>
                  <ul>
                    {location.pathname !== "/info-user" && (
                      <li>
                        <a
                          href="/info-user"
                          className="block px-4 py-2 custom-text-gray hover:bg-gray-100"
                        >
                          {t("menu.profile")}
                        </a>
                      </li>
                    )}
                    {user.user.role === "ADMIN" ? (
                      <li>
                        <a
                          href="/admin/QuanLyNguoiDung"
                          className="block px-4 py-2 custom-text-gray hover:bg-gray-100"
                        >
                          {t("menu.admin")}
                        </a>
                      </li>
                    ) : (
                      <></>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        {t("menu.logout")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                ref={userIconRef}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer bg-gray-800 text-white transition-all duration-300 ${
                  showDropdown ? "ring-4 ring-red-400" : "ring-2 ring-gray-300"
                } hover:ring-4 hover:ring-red-400`}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <i className="fas fa-user text-xl"></i>
              </div>
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full mt-2 right-0 bg-white shadow-md rounded-lg overflow-hidden"
                  style={{ zIndex: 1000, width: "200px" }}
                >
                  <ul>
                    <li>
                      <button
                        onClick={() => handleOpenModal("login")}
                        className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {t("menu.login")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleOpenModal("register")}
                        className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {t("menu.regester")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Menu Mobile */}
        <div className="block lg:hidden" ref={dropdownRefMobi}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="text-gray-500 text-2xl focus:outline-none"
          >
            <i className="fa fa-align-justify"></i>
          </button>

          <div
            className={`absolute top-full left-0 w-[100vw] text-white overflow-hidden transform transition-transform duration-1000 ${
              isDropdownOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            {isDropdownOpen && (
              <ul className="container bg-gray-700 rounded-lg space-y-2 py-4">
                {[
                  { label: t("menu.home"), link: "/", action: null },
                  { label: t("menu.room"), link: "/rooms", action: null },
                  {
                    label: t("menu.list"),
                    link: null,
                    action: () => handleScrollTo("listSection"),
                    showOnHome: true,
                  },
                  {
                    label: t("menu.favourite"),
                    link: null,
                    action: () => handleScrollTo("locationSection"),
                    showOnHome: true,
                  },
                  {
                    label: t("menu.contact"),
                    link: null,
                    action: () => handleScrollTo("contactSection"),
                  },
                ]
                  .filter(({ showOnHome }) => {
                    if (showOnHome && window.location.pathname !== "/")
                      return false;
                    return true;
                  })
                  .map(({ label, link, action }) => (
                    <li
                      key={label}
                      className="px-6 py-3 hover:bg-gray-600 text-left border-b border-gray-600 last:border-b-0"
                    >
                      {link ? (
                        <NavLink
                          to={link}
                          className={({ isActive }) =>
                            `block text-left font-semibold text-menu ${
                              isActive ? "text-red-400" : "text-white" // Adjust for mobile menu styling
                            }`
                          }
                        >
                          {label}
                        </NavLink>
                      ) : (
                        <a
                          onClick={action!}
                          className="block text-left text-menu"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                <li className="px-6 py-3 border-gray-600 flex justify-between items-center">
                  <span className="text-white font-semibold">
                    {t("homepage.mode")}
                  </span>
                  <DarkLightToggle />
                </li>
                <li className="px-6 py-3 border-t border-gray-600 flex justify-between items-center">
                  <span className="text-white font-semibold">
                    {t("homepage.locale")}
                  </span>

                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        {modalContent === "login" ? (
          <TempFormLogin
            onLoginSuccess={() => {
              dispatch(setIsModalOpen(false));
              setShowDropdown(false);
            }}
          />
        ) : (
          <TempFormRegister
            onRegisterSuccess={() => {
              dispatch(setModalContent("login"));
              setShowDropdown(false);
            }}
          />
        )}
      </Modal>
    </header>
  );
};

export default TempHeader;
