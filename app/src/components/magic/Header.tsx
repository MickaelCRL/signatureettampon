import Image from "next/image";
import Logo from "public/logo.svg";
import DevLinks from "./DevLinks";

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-title">Signature et Tampon</div>
      <div className="account">Mon compte</div>
    </div>
  );
};

export default Header;
