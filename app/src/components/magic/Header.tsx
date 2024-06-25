import Image from "next/image";
import Logo from "public/logo.svg";
import DevLinks from "./DevLinks";
import { useState } from "react";
import UserPopup from "../user/UserPopup";
import Disconnect from "./wallet-methods/Disconnect";
import GetIdToken from "./wallet-methods/GetIdToken";
import GetMetadata from "./wallet-methods/GetMetadata";
import { LoginProps } from "@/utils/types";
import { LoginMethod } from "@/utils/common";
import Card from "../ui/Card";

const Header = ({
  isLoggedIn,
  token,
  setToken,
}: { isLoggedIn: boolean } & LoginProps) => {
  return (
    <div className="header-container">
      <div className="header-title">Signature et Tampon</div>
      {isLoggedIn && (
        <div className="account">
          <Disconnect token={token} setToken={setToken} />
        </div>
      )}
    </div>
  );
};

export default Header;
