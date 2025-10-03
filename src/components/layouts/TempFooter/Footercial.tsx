import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import airbnbLogo from "../../../assets/image/logoAirbnb.png";
import { useTranslation } from "react-i18next";
import trip from "../../../assets/logo/trip.png";
import klook from "../../../assets/logo/Klook.png";
import traveloka from "../../../assets/logo/traveloka.png";
import ivivu from "../../../assets/logo/ivivu.png";
import booking from "../../../assets/logo/Booking.svg";


const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLinkClick = () => {
    window.location.href = "https://www.airbnb.com.vn/";
  };

  return (
    <footer
  id="contactSection"
  className="bg-gradient-to-r from-[#fdfcfb] to-[#e2d1c3] text-gray-800 py-14"
>
  <div className="container mx-auto px-6">
    {/* Grid content */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Logo and Contact */}
      <div>
        <div
          className="flex items-center gap-2 text-3xl font-bold cursor-pointer mb-4"
          onClick={() => navigate("/")}
        >
          <img
            src={airbnbLogo}
            className="w-10 h-10 object-contain"
            alt="Airbnb logo"
          />
          <span className="text-pink-600">airbnb</span>
        </div>
        <p className="text-sm">
          Email: <span className="text-pink-600">airbnb@gmail.com</span>
        </p>
        <p className="uppercase text-xs mt-2 text-gray-500">
          {t("homepage.Footer.row1.customerServices")}
        </p>
        <p className="font-semibold text-pink-600">0982919123</p>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-3 text-pink-700">
            {t("homepage.Footer.row1.Partner")}
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-3">
            {/* partner logos */}
            <Link
              to="https://www.agoda.com/vi-vn/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Agoda_logo_2019.svg/2560px-Agoda_logo_2019.svg.png"
                className="w-10 h-10 object-contain hover:scale-110 transition-transform"
                alt="agoda"
              />
            </Link>
            <img
              src={trip}
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
              alt="trip"
            />
            <img
              src={klook}
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
              alt="klook"
            />
            <img
              src={traveloka}
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
              alt="traveloka"
            />
            <img
              src={ivivu}
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
              alt="ivivu"
            />
            <img
              src={booking}
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
              alt="booking"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-bold mb-4 text-pink-700">
          {t("homepage.Footer.row2.title")}
        </h4>
        <ul className="space-y-2 text-sm">
          {[
            t("homepage.Footer.row2.how_airbnb_works"),
            t("homepage.Footer.row2.newsroom"),
            t("homepage.Footer.row2.investors"),
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-pink-600 transition-colors"
              onClick={handleLinkClick}
            >
              <ChevronRight size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Informational Links */}
      <div>
        <h4 className="text-lg font-bold mb-4 text-pink-700">
          {t("homepage.Footer.row3.title")}
        </h4>
        <ul className="space-y-2 text-sm">
          {[
            t("homepage.Footer.row3.diversity_belonging"),
            t("homepage.Footer.row3.accessibility_features"),
            t("homepage.Footer.row3.airbnb_affiliates"),
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-pink-600 transition-colors"
              onClick={handleLinkClick}
            >
              <ChevronRight size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <input
          type="text"
          placeholder="Email*"
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
        />
        <button className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors">
          Subscribe
        </button>

        <div className="flex gap-4 mt-5 text-xl text-pink-600">
          <FontAwesomeIcon icon={faFacebook} className="hover:scale-125" />
          <FontAwesomeIcon icon={faTwitter} className="hover:scale-125" />
          <FontAwesomeIcon icon={faGithub} className="hover:scale-125" />
          <FontAwesomeIcon icon={faInstagram} className="hover:scale-125" />
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
      <p>
        © 2025 <span className="text-pink-600 font-bold">AIRBNB</span>. All
        Rights Reserved.
      </p>
      <div className="flex gap-4 mt-4 md:mt-0">
        <img
          src="/images/Footer/google-play.webp"
          alt="Google Play"
          className="h-8 hover:scale-110 transition-transform"
        />
        <img
          src="/images/Footer/apple.webp"
          alt="App Store"
          className="h-8 hover:scale-110 transition-transform"
        />
      </div>
    </div>
  </div>
</footer>

  );
};

export default Footer;
