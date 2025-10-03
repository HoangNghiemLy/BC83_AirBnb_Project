import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../config/appwrite";
import { useDispatch } from "react-redux";
import { setLoginData, setModalContent } from "../../store/slices/userSlice";
import { authServices } from "../../services/authServices";
import { nguoiDungServices } from "../../services/nguoiDungServices";
import type { User as BackendUser } from "../../types/User";
import type { AppDispatch } from "../../store/store";
import type { RegisterRequest } from "../../types/auth";
import { getListIdBookingAction } from "../../store/thunks/bookingThunks";
import { imageUrlToBlob } from "../../utils/FileAnh";
import dayjs from "dayjs";
import { message } from "antd";
import { turnOnLoading, turnOffLoading } from "../../store/slices/spinnerSlice";
import { useTranslation } from "react-i18next";
async function uploadAvatarFromUrl(avatarUrl: string, token: string) {
  const imageFile = await imageUrlToBlob(avatarUrl);
  // console.log("imageFile: ", imageFile);

  if (imageFile) {
    const formData = new FormData();
    formData.append("formFile", imageFile, "avatar.jpg");

    try {
      const response = await fetch(
        "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
        {
          method: "POST",
          body: formData,
          headers: {
            token: token,
            tokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Upload failed with status ${response.status}: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const result = await response.json();
      // console.log("Upload avatar successful:", result);
      return result;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  } else {
    console.error("Failed to get image file from URL.");
    return null;
  }
}

const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchUser = async () => {
      dispatch(turnOnLoading());
      try {
        // const user = await account.get();
        // console.log("Check user: ", user);
        const session = await account.getSession("current");

        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${session.providerAccessToken}`,
            },
          }
        );

        const profile = await response.json();
        // console.log("Profile: ", profile);

        const { email, name, picture, sub } = profile;
        const dummyPassword = `GOOGLEPASSWORD${sub}`;

        const allUsersRes = await nguoiDungServices.getListUserGoole();
        const userList: BackendUser[] = allUsersRes.data.content;
        const existingUser = userList.find((u) => u.email === email);
        const today = dayjs().format("YYYY-MM-DD");
        if (existingUser) {
          // Đăng nhập nếu đã tồn tại
          const loginData = await authServices.login({
            email,
            password: dummyPassword,
          });
          const { user, token } = loginData.content;

          const normalizedUser = {
            ...user,
            avatar: user.avatar ?? undefined,
          };

          const userData = { user: normalizedUser, token };
          dispatch(setLoginData(userData));
          localStorage.setItem("USER_LOGIN", JSON.stringify(userData));
          dispatch(getListIdBookingAction(user.id));
        } else {
          // Đăng ký nếu chưa có
          const registerData: RegisterRequest = {
            id: 0,
            email: email,
            password: dummyPassword,
            name: name,
            phone: "",
            birthday: today,
            gender: true,
            role: "GOOGLE",
            avatar: picture,
          };
          // console.log("Register data: ", registerData);

          try {
            // dispatch(turnOnLoading());
            await authServices.register(registerData);
            dispatch(setModalContent("login"));

            const loginData = await authServices.login({
              email,
              password: dummyPassword,
            });

            const { user, token } = loginData.content;

            const uploadResult = await uploadAvatarFromUrl(picture, token);
            const newAvatar = uploadResult?.content?.avatar;

            const normalizedUser = {
              ...user,
              avatar: (newAvatar || user.avatar) ?? undefined,
            };

            const userData = { user: normalizedUser, token };
            dispatch(setLoginData(userData));
            localStorage.setItem("USER_LOGIN", JSON.stringify(userData));
            dispatch(getListIdBookingAction(user.id));
          } catch (error) {
            console.error("OAuth login error", error);
            message.error(t("message.error.login"));
          }
        }

        navigate("/");
      } catch (err) {
        console.error("OAuth login error", err);
        navigate("/login");
      } finally {
        dispatch(turnOffLoading());
        message.success(t("message.success.login"));
      }
    };

    fetchUser();
  }, [dispatch, navigate, t]);
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold">Đang đăng nhập bằng Google...</p>
    </div>
  );
};

export default OAuthCallback;
