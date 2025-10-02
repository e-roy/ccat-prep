import { RouterProvider, useRouter } from "@/lib/router";
import Navigation from "@/components/Navigation";
import LandingPage from "@/pages/LandingPage";
import ListenPage from "@/pages/ListenPage";
import SettingsPage from "@/pages/SettingsPage";
import HistoryPage from "@/pages/HistoryPage";

function AppContent() {
  const { currentRoute } = useRouter();

  const renderPage = () => {
    switch (currentRoute) {
      case "landing":
        return <LandingPage />;
      case "history":
        return <HistoryPage />;
      case "listen":
        return <ListenPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      {/* Main content area with proper spacing for sidebar */}
      <div className="md:pl-64">{renderPage()}</div>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
