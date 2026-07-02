import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { GlobalFooter } from "../components/GlobalFooter";

export function RootLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col selection:bg-blue-500/30">
      {!isDashboard && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isDashboard && <GlobalFooter />}
    </div>
  );
}