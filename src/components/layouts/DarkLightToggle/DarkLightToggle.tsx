import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setThemeMode } from "../../../store/slices/darkModeSlice";
import type { RootState, AppDispatch } from "../../../store/store";

const DarkLightToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { themeMode } = useSelector((state: RootState) => state.darkModeSlice);

  const [switchState, setSwitchState] = useState<boolean>(
    () => themeMode === "dark"
  );

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const onChangeTheme = (checked: boolean) => {
    setSwitchState(checked);
    dispatch(setThemeMode(checked ? "dark" : "light"));
  };

  return (
    <Switch
      onChange={onChangeTheme}
      checked={switchState}
      checkedChildren={<i className="fas fa-moon"></i>}
      unCheckedChildren={<i className="fas fa-sun"></i>}
    />
  );
};

export default DarkLightToggle;
