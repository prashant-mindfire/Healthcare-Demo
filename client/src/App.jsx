import { BrowserRouter as Router } from "react-router-dom";
import RouteConfig from "./routes/RouteConfig.jsx";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
        <Router>
          <RouteConfig />
        </Router>
    </>
  );
}

export default App;
