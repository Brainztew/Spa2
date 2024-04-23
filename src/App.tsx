import { useEffect, useState } from "react";
import "./App.css";
import About from "./components/About";
import Booking from "./components/Booking";
import Booked from "./components/Booked";
import Start from "./components/Start";
import Meny from "./components/Meny";

function App() {
  const [page, setPage] = useState<string>("");

  let pageUrl = page;

  useEffect(() => {
    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
      <h1>Välkommen till en värld full av SPA!</h1>
      <Meny setPage={setPage} />
      {{
        start: <Start />,
        about: <About />,
        booking: <Booking />,
        booked: <Booked />,
      }[page] || <Start />}
    </>
  );
}

export default App;
