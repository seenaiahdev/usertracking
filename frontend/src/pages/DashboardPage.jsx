// Dashboard page — full layout with tab state persistence across browser refreshes via URL params & localStorage
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import HomeView from "../views/HomeView";
import LiveView from "../views/LiveView";
import SessionsView from "../views/SessionsView";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const getInitialTab = () => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["home", "live", "sessions"].includes(tabParam)) {
      return tabParam;
    }
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab && ["home", "live", "sessions"].includes(savedTab)) {
      return savedTab;
    }
    return "home";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync initial tab into URL if missing
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, []);

  // Auto-close sidebar on mobile when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
    localStorage.setItem("activeTab", tab);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <div className="dashboard-body">
        {sidebarOpen && window.innerWidth <= 768 && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <main className="main-content" id="main-content-area">
          {activeTab === "home" && <HomeView onTabChange={handleTabChange} />}
          {activeTab === "live" && <LiveView />}
          {activeTab === "sessions" && <SessionsView />}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
