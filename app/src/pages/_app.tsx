import "@/styles/dashboard.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/userpopup.css";
import "@/styles/addsignatories.css";
import { TokenProvider } from "@/utils/TokenContext";
import { DocumentProvider } from "@/context/DocumentContext";
import type { AppProps } from "next/app";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TokenProvider>
      <EdgeStoreProvider>
        <DocumentProvider>
          <Component {...pageProps} />
        </DocumentProvider>
      </EdgeStoreProvider>
    </TokenProvider>
  );
}
