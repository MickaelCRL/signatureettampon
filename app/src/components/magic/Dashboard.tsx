import React from "react";
import WalletMethods from "./cards/WalletMethodsCard";
import SendTransaction from "./cards/SendTransactionCard";
import Spacer from "@/components/ui/Spacer";
import { LoginProps } from "@/utils/types";
import UserInfo from "./cards/UserInfoCard";
import DevLinks from "./DevLinks";
import Header from "./Header";
import dynamic from "next/dynamic";

const WebviewerComponent = dynamic(
  () => import("@/webviewer/WebviewerComponent"),
  { ssr: false }
);

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="home-page">
      <Header />
      <div className="cards-container">
        {/* <UserInfo token={token} setToken={setToken} /> */}
        <Spacer size={10} />
        {/* <WalletMethods token={token} setToken={setToken} /> */}
        <Spacer size={15} />
      </div>

      {/* <WebviewerComponent /> */}
    </div>
  );
}
