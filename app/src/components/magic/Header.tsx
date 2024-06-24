import Image from "next/image";
import Logo from "public/logo.svg";
import DevLinks from "./DevLinks";
import { useState } from "react";
import UserPopup from "../user/UserPopup";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="header-container">
      <div className="header-title">Signature et Tampon</div>
      {isLoggedIn && (
        <div className="account" onClick={(disconnect) => {}}>
          Se déconnecter
        </div>
      )}
    </div>
  );
};

export default Header;
