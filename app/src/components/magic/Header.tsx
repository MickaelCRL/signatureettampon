import Image from "next/image";
import Logo from "public/logo.svg";
import DevLinks from "./DevLinks";
import { useState } from "react";
import UserPopup from "../user/UserPopup";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="header-container">
      <div className="header-title">Signature et Tampon</div>
      {isLoggedIn && (
        <div
          className="account"
          onClick={() => {
            console.log("mon compte click");
            setIsPopupOpen(!isPopupOpen);
          }}
        >
          Mon compte
        </div>
      )}
      {isPopupOpen && (
        <UserPopup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      )}
    </div>
  );
};

export default Header;
