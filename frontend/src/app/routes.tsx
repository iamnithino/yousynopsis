import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { Aboutdash } from "./pages/Aboutdash";
import { WorkspacePage } from "./pages/WorkspacePage";
import SummaryPage from "./pages/SummaryPage";
import ComparisonSummaryPage from "./pages/ComparisonSummaryPage";
import PresentationEditorPage from "./pages/PresentationEditorPage";
import TestOptionsPage from "./pages/TestOptionsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUpPage } from "./pages/SignUpPage";
import { ContactPage } from "./pages/ContactPage";
import { PricingPage } from "./pages/PricingPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LoadingState } from "./pages/LoadingState";
import { GlobalFooter } from "./components/GlobalFooter";
import { Navbar } from "./components/Navbar";

export function RootLayout() {
  const location = useLocation();
  const isExcluded =
    location.pathname.includes('/dashboard') ||
    location.pathname.includes('/summary') ||
    location.pathname.includes('/Aboutdash') ||
    location.pathname.includes('/profile') ||
    location.pathname.includes('/contact') ||
    location.pathname.includes('/pricing') ||
    location.pathname.includes('/features') ||
    location.pathname.includes('/workspace') ||
    location.pathname.includes('/history') ||
    location.pathname.includes('/loading') ||
    location.pathname.includes('/comparison-summary') ||
    location.pathname.includes('/presentation-editor') ||
    location.pathname.includes('/test-options');

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col selection:bg-blue-500/30">
      {!isExcluded && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isExcluded && <GlobalFooter />}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "/", Component: LandingPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "about", Component: AboutUsPage },
      { path: "aboutdash", Component: Aboutdash },
      { path: "contact", Component: ContactPage },
      { path: "pricing", Component: PricingPage },
      { path: "features", Component: FeaturesPage },
      { path: "profile", Component: ProfilePage },
      { path: "summary", Component: SummaryPage },
      { path: "comparison-summary", Component: ComparisonSummaryPage },
      { path: "presentation-editor", Component: PresentationEditorPage },
      { path: "test-options", Component: TestOptionsPage },
      { path: "workspace", Component: WorkspacePage },
      { path: "history", Component: HistoryPage },
      { path: "loading", Component: LoadingState },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignUpPage },
    ],
  },
]);
