import Image from "next/image";
import Logo from "public/images/logo-menu.png";
import { LoginProps } from "@/utils/types";
import Disconnect from "./magic/wallet-methods/Disconnect";

const Header = ({
  isLoggedIn,
  token,
  setToken,
}: { isLoggedIn: boolean } & LoginProps) => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <Image src={Logo} alt="Logo" width={60} height={60} />
      </div>
      <nav className="nav-menu">
        <a href="/">Accueil</a>
        <a href="/document-a-signer">Documents à signer</a>
        <a href="/about">À propos</a>
        <a href="/contact">Contact</a>
      </nav>
      {isLoggedIn && (
        <div className="account">
          <Disconnect token={token} setToken={setToken} />
        </div>
      )}
    </header>
  );
};

export default Header;
