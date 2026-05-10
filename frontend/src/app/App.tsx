import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Landing } from "./components/Landing";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { OfficerDashboard } from "./components/OfficerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { EligibilityForm } from "./components/EligibilityForm";
import { Schemes } from "./components/Schemes";
import { SchemeDetailsPage } from "./components/SchemeDetailsPage";
import { History } from "./components/History";
import { Help } from "./components/Help";
import Profile from "./components/Profile";
import { TrackApplications } from "./components/TrackApplications";

type Screen = "dashboard" | "profile";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] =
    useState<"user" | "officer" | "admin">("user");

  const [authView, setAuthView] =
    useState<"landing" | "login" | "signup">("landing");

  const [screen, setScreen] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");

  const [selectedSchemeId, setSelectedSchemeId] =
    useState<number | null>(null);

  /* ================= AUTH ================= */

  const handleLogin = (role: "user" | "officer" | "admin") => {
    setIsAuthenticated(true);
    setUserRole(role);
    setScreen("dashboard");

    if (role === "user") setCurrentView("home");
    else if (role === "officer") setCurrentView("officer-dashboard");
    else setCurrentView("admin-dashboard");
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    setUserRole("user");
    setScreen("dashboard");
    setCurrentView("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("user");
    setAuthView("landing");
    setCurrentView("home");
    setScreen("dashboard");
    setSelectedSchemeId(null);
    localStorage.removeItem("user");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSidebarOpen(false);
    setScreen("dashboard"); 
  };

  /* ================= SCHEME HANDLER ================= */

  const handleViewSchemeDetails = (id: number) => {
    setSelectedSchemeId(id);
    setCurrentView("scheme-details");
  };

  /* ================= AUTH SCREENS ================= */

  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          onLogin={handleLogin}
          onBackToLanding={() => setAuthView("landing")}
          onGoToSignup={() => setAuthView("signup")}
        />
      );
    }

    if (authView === "signup") {
      return (
        <Signup
          onSignup={handleSignup}
          onBackToLanding={() => setAuthView("landing")}
          onGoToLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <Landing
        onLogin={() => setAuthView("login")}
        onSignup={() => setAuthView("signup")}
      />
    );
  }

  /* ================= MAIN CONTENT ================= */

  const renderContent = () => {
    if (screen === "profile") {
      return <Profile onBack={() => setScreen("dashboard")} />;
    }

    /* -------- USER -------- */
    if (userRole === "user") {
      switch (currentView) {
        case "home":
          return <Home onNavigate={handleNavigate} />;

        case "dashboard":
          return (
            <Dashboard
              onNavigateToEligibility={() =>
                setCurrentView("eligibility")
              }
              onViewSchemeDetails={handleViewSchemeDetails}
            />
          );

        case "eligibility":
          return <EligibilityForm onBack={() => setCurrentView("home")} />;

        case "schemes":
          return <Schemes onViewDetails={handleViewSchemeDetails} />;

        case "scheme-details":
          return (
            <SchemeDetailsPage
              schemeId={selectedSchemeId}
              onBack={() => setCurrentView("schemes")}
            />
          );

        case "history":
          return <History />;

        case "track-applications":
          return <TrackApplications onViewSchemeDetails={handleViewSchemeDetails} />;

        case "help":
          return <Help />;

        default:
          return <Home onNavigate={handleNavigate} />;
      }
    }

    /* -------- OFFICER -------- */
    if (userRole === "officer") {
      switch (currentView) {
        case "officer-dashboard":
          return <OfficerDashboard view="dashboard" />;
        case "applications":
          return <OfficerDashboard view="applications" />;

        case "schemes":
          return <Schemes onViewDetails={handleViewSchemeDetails} />;

        case "scheme-details":
          return (
            <SchemeDetailsPage
              schemeId={selectedSchemeId}
              onBack={() => setCurrentView("schemes")}
            />
          );

        case "help":
          return <Help />;

        default:
          return <OfficerDashboard />;
      }
    }

    /* -------- ADMIN -------- */
    if (userRole === "admin") {
      switch (currentView) {
        case "admin-dashboard":
          return <AdminDashboard view="overview" />;
        case "admin-schemes":
          return <AdminDashboard view="schemes" />;
        case "admin-officers":
          return <AdminDashboard view="officers" />;
        case "admin-applications":
          return <AdminDashboard view="applications" />;
        case "admin-users":
          return <AdminDashboard view="users" />;

        case "schemes":
          return <Schemes onViewDetails={handleViewSchemeDetails} />;

        case "scheme-details":
          return (
            <SchemeDetailsPage
              schemeId={selectedSchemeId}
              onBack={() => setCurrentView("schemes")}
            />
          );

        case "help":
          return <Help />;

        default:
          return <AdminDashboard />;
      }
    }

    return <Home onNavigate={handleNavigate} />;
  };

  /* ================= LAYOUT ================= */

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
        onViewProfile={() => setScreen("profile")} 
        isAuthenticated={isAuthenticated}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onNavigate={handleNavigate}
          userRole={userRole}
        />

        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
