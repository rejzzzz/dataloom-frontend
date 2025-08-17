import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
    <>
        <Navbar />
        <main>{children}</main>
    </>
);

export default Layout;
