import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { InstallAppBanner } from "../InstallAppBanner";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50">
      <InstallAppBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
