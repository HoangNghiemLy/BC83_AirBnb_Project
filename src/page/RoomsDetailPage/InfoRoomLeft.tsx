import { useState } from "react";
import { useSelector } from "react-redux";
import winner from "../../assets/image/winner.png";
import type { RootState } from "../../types/Phong";
import profile from "../../assets/image/cat.png";
import { useTranslation } from "react-i18next";

export default function InfoRoomLeft() {
  const { t } = useTranslation();
  const features = t("detailPage.features", { returnObjects: true }) as {
    icon: string;
    title: string;
    desc: string;
  }[];

  const { infoRoom, listComment } = useSelector(
    (state: RootState) => state.detailRoomSlice
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const calculateAverageRating = () => {
    if (!listComment || listComment.length === 0) return 0;
    const total = listComment.reduce(
      (sum, comment) => sum + (comment?.saoBinhLuan || 0),
      0
    );
    return parseFloat((total / listComment.length).toFixed(2));
  };

  const renderRatingAward = () => {
    const finalNum = calculateAverageRating();
    if (finalNum >= 4) {
      return (
        <div className="text-cyan-400">
          <span>{t("detailPage.Platinum")} </span>
          <i className="fa fa-award"></i>
        </div>
      );
    }
    if (finalNum >= 3) {
      return (
        <div className="text-primary">
          <span>{t("detailPage.Gold")} </span>
          <i className="fa fa-award"></i>
        </div>
      );
    }
    if (finalNum > 0) {
      return (
        <div className="text-gray-400">
          <span>{t("detailPage.Silver")} </span>
          <i className="fa fa-award"></i>
        </div>
      );
    }
    return null;
  };

  const renderFavorite = () => {
    const finalNum = calculateAverageRating();
    if (finalNum >= 4) {
      return (
        <div className="container border-2 border-gray-300 py-5 px-7 rounded-lg">
          <div className="flex items-center">
            <img src={winner} alt="Winner" className="h-20 w-20 mx-auto" />
          </div>
          <div className="text-center">
            <p>{t("detailPage.titleStart")}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!infoRoom) return null;

  const fullDescription = infoRoom?.moTa || "";
  const shortDescription =
    fullDescription.length > 100
      ? fullDescription.slice(0, 100) + "..."
      : fullDescription;

  const descriptionToShow = isExpanded ? fullDescription : shortDescription;

  return (
    <div className="basis-2/3 divide-y-2 space-y-5">
      {/* Header thông tin */}
      <div className="space-y-5 py-5 border-b-2 border-gray-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {t("detailPage.title")}{" "}
              <span className="underline uppercase">PETER</span>
            </h1>
            <p>
              {infoRoom.khach} {t("rooms.Guests")} - {infoRoom.phongNgu}{" "}
              {t("rooms.Bedrooms")} - {infoRoom.giuong} {t("rooms.Beds")} -{" "}
              {infoRoom.phongTam} {t("rooms.Bathrooms")}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <img
              className="w-12 h-12 rounded-full"
              src={profile}
              alt="avatar"
            />
            {renderRatingAward()}
          </div>
        </div>
        {renderFavorite()}
      </div>

      {/* Quyền lợi (features) */}
      {Array.isArray(features) && features.length > 0 && (
        <div className="py-5 space-y-3 border-b-2 border-gray-300">
          {features.map((item, idx) => (
            <div className="flex gap-2 text-primary" key={idx}>
              <div>
                <i className={`fa ${item.icon}`}></i>
              </div>
              <div>
                <h1 className="font-bold">{item.title}</h1>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mô tả */}
      {infoRoom.moTa && (
        <div className="py-5 border-b-2 border-gray-300">
          <p>{descriptionToShow}</p>
          {infoRoom.moTa.length > 100 && (
            <button onClick={toggleReadMore} className="font-bold">
              {isExpanded ? t("comment.Collapse") : t("comment.seeMore")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
