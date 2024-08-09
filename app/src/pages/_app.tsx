import "@/styles/dashboard.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/userpopup.css";
import "@/styles/addsignatories.css";
import "@/styles/hero.css";
import { TokenProvider } from "@/utils/TokenContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { UserProvider } from "@/context/UserContext";
import type { AppProps } from "next/app";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TokenProvider>
      <EdgeStoreProvider>
        <UserProvider>
          <DocumentProvider>
            <Component {...pageProps} />
          </DocumentProvider>
        </UserProvider>
      </EdgeStoreProvider>
    </TokenProvider>
  );
}
