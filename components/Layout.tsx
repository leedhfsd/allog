import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type ComponentProps = {
  children: ReactNode;
};

export default function Layout({ children }: ComponentProps) {
  return (
    <div className="mx-4 lg:mx-24">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
