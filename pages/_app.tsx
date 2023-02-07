import { Noto_Sans_KR } from "@next/font/google";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import Layout from "../components/Layout";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-notoSansKR",
  weight: ["400", "700"],
  style: "normal",
  subsets: ["korean"],
});

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  const router = useRouter();

  return router.pathname !== "/write" ? (
    <SessionProvider session={pageProps.session}>
      <div className={`${notoSansKR.variable} font-kor`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SessionProvider>
  ) : (
    <SessionProvider session={pageProps.session}>
      <div className={`${notoSansKR.variable} font-kor`}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
