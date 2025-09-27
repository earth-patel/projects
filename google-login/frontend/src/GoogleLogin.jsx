import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import { useNavigate } from "react-router-dom";

function GoogleLogin() {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const { name, email, image } = result.data.user;
        const token = result.data.token;
        const obj = { name, email, image, token };
        localStorage.setItem("user-info", JSON.stringify(obj));
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Error while requesting google login", err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}

export default GoogleLogin;
