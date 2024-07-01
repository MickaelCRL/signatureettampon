import "@/styles/dashboard.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/userpopup.css";
import "@/styles/addsignatories.css";
import { TokenProvider } from "@/utils/TokenContext";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TokenProvider>
      <Component {...pageProps} />
    </TokenProvider>
  );
}
