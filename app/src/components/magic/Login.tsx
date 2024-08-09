import { LoginProps } from "@/utils/types";
import Header from "../Header";

import EmailOTP from "./auth/EmailOTP";

const Login = ({ token, setToken }: LoginProps) => {
  return (
    <>
      <EmailOTP token={token} setToken={setToken} />
    </>
  );
};

export default Login;
