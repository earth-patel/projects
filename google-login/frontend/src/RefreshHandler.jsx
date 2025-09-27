import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function RefreshHandler({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const token = JSON.parse(data)?.token;
    if (token) {
      setIsAuthenticated(true);
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/dashboard", { replace: false });
      }
    }
  }, [navigate, location, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
