// Dashboard page — full layout with Navbar, Sidebar, backdrop overlay for mobile, and dynamic content views
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import HomeView from "../views/HomeView";
import LiveView from "../views/LiveView";
import SessionsView from "../views/SessionsView";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeTab, setActiveTab] = useState("home");

  // Auto-close sidebar on mobile when tab changes or window resizes
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
