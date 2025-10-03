import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import error404 from "../../../assets/animations/Error404.json";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-md text-center flex flex-col items-center justify-center">
        <div>
          <Lottie
            animationData={error404}
            loop={true}
            className="w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-5xl text-center font-extrabold text-[#FE6B6E] mb-4">
            {t("404.title")}
          </h1>

          <h2 className="text-2xl font-semibold mb-2">{t("404.subtitle")}</h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("404.description")}
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-3 button-404 font-medium rounded-lg shadow-md transition duration-300"
          >
            {t("404.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
