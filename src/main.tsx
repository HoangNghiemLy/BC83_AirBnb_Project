import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import "antd/dist/reset.css";
import { store } from "./store/store.ts";
import { App as AntdApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import { updateDayjsLocale } from "./utils/dayjsLocale";
import App from "./App.tsx";
import "./index.css";
const newQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});
const theme = {
  token: {
    colorPrimary: "rgb(254, 107, 110)",
  },
};
updateDayjsLocale();
createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={theme}>
    <AntdApp>
      {" "}
      {/* 👈 Đây là wrapper bắt buộc cho Ant Design v5 */}
      <Provider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={newQueryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </Provider>
    </AntdApp>
  </ConfigProvider>
);
