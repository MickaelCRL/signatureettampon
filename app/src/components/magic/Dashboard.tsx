import React from "react";
import WalletMethods from "./cards/WalletMethodsCard";
import SendTransaction from "./cards/SendTransactionCard";
import Spacer from "@/components/ui/Spacer";
import { LoginProps } from "@/utils/types";
import UserInfo from "./cards/UserInfoCard";
import DevLinks from "./DevLinks";
import Header from "./Header";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/router";

const WebviewerComponent = dynamic(
  () => import("@/webviewer/WebviewerComponent"),
  { ssr: false }
);

export default function Dashboard({ token, setToken }: LoginProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/sign-document");
  };
  return (
    <div className="home-page">
      <Header isLoggedIn={true} token={token} setToken={setToken} />
      <div className="cards-container">
        {/* <UserInfo token={token} setToken={setToken} /> */}
        <Spacer size={10} />
        {/* <WalletMethods token={token} setToken={setToken} /> */}
        <Spacer size={15} />
      </div>

      <>
        <p className="title-center">Signer un document</p>
        <button className="btn-primary" onClick={handleClick}>
          Commencer
        </button>
      </>
    </div>
  );
}
