import { Outlet } from "@tanstack/react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "url(/assets/generated/cyber-bg-texture.dim_1920x1080.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "rgba(5, 8, 20, 0.82)" }}
      >
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
