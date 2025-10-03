import "./App.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import AOS from "aos";
import useRouterElements from "./routes/elements";
import { ToastContainer } from "react-toastify";
import Spinner from "./components/layouts/spinner/Spinner";

AOS.init();
function App() {
  const elements = useRouterElements();
  return (
    <>
      <Spinner />
      <ToastContainer />
      {elements}
    </>
  );
}

export default App;
