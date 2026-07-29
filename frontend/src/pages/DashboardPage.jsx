// Dashboard page — full layout with Navbar, Sidebar, and dynamic content views
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import HomeView from "../views/HomeView";
import LiveView from "../views/LiveView";
import SessionsView from "../views/SessionsView";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="dashboard-wrapper">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <div className="dashboard-body">
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
