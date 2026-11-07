import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./effects.css";

// StrictMode is left off on purpose: the preloader and the 3D showpieces start timers once.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
