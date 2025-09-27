import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Dashboard from "./Dashboard";
import GoogleLogin from "./GoogleLogin";
import PageNotFound from "./PageNotFound";
import RefreshHandler from "./RefreshHandler";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="908425521096-pt2c34r9lvpj1kasmojfksk465svr8rn.apps.googleusercontent.com">
        <GoogleLogin />
      </GoogleOAuthProvider>
    );
  };

  // eslint-disable-next-line react/prop-types
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
