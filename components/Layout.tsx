import { ReactNode } from "react";
import Header from "./Header";

type ComponentProps = {
  children: ReactNode;
};

export default function Layout({ children }: ComponentProps) {
  return (
    <div className="mx-4 lg:mx-24 py-4">
      <Header />
      <main>{children}</main>
    </div>
  );
}
