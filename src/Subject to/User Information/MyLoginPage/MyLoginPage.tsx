import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

interface MyLoginPageProps {
  onGoogleLogin: (response: CredentialResponse) => void;
}

const MyLoginPage: React.FC<MyLoginPageProps> = ({ onGoogleLogin }) => {
  return (
    <div style={{ width: "70%", margin: "10px" }}>
      <GoogleLogin
        onSuccess={onGoogleLogin}
        onError={() => alert("Google login failed")}
        useOneTap
      />
    </div>
  );
};

export default MyLoginPage;
