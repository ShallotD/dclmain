// export default AdminLayout;
import React, { useState, useEffect } from "react";
import { Spin, Alert, Table, Tag, Menu } from "antd"; // ✅ Menu included
import { CheckCircle, Clock, Users } from "lucide-react";

import AdminDashboard from "../../pages/admin/AdminDashboard.jsx";
import CreateUserDrawer from "../../pages/admin/createUserDrawer.jsx";
import DashboardSummary from "../../pages/admin/dashboardSummary.jsx";
// import AuditTrailViewer from "../../pages/admin/AuditTrailViewer.jsx";
import Navbar from "../Navbar.jsx";
import { useGetLogsQuery } from "../../api/logApi";
import { useGetUsersQuery } from "../../api/userApi";
import socket from "../../app/socket";
import OnlineUsersTable from "../../pages/admin/OnlineUsersTable.jsx";
import UserAuditTrailPage from "../../pages/admin/AuditTrailViewer.jsx";
import SharedSidebar from "../common/SharedSidebar";

const themeVars = {
  light: {
    "--bg-main": "#f4f6ff",
    "--bg-sidebar": "#2B1C67",
    "--bg-navbar": "#ffffff",
    "--text-main": "#2B1C67",
    "--sidebar-shadow": "rgba(0,0,0,0.15)",
  },
  dark: {
    "--bg-main": "#181a1f",
    "--bg-sidebar": "#1c143a",
    "--bg-navbar": "#22252b",
    "--text-main": "#ffffff",
    "--sidebar-shadow": "rgba(255,255,255,0.15)",
  },
};
const applyTheme = (mode) => {
  Object.entries(themeVars[mode]).forEach(([key, value]) =>
    document.documentElement.style.setProperty(key, value)
  );
};

/* ADMIN LAYOUT */
const AdminLayout = () => {
  const [selectedKey, setSelectedKey] = useState("all users");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const menuItems = [
    {
      key: "all users",
      label: "All users",
      icon: <CheckCircle size={18} />,
    },
    { key: "auditlogs", label: "Audit Logs", icon: <Clock size={18} /> },
    {
      key: "onlineusers",
      label: "Online Users",
      icon: <Users size={18} />,
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "rm",
  });

  applyTheme(theme);

  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
  } = useGetLogsQuery();

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 5000,
  });

  console.log("Fetched Logs:", logs);
  console.log("Fetched Users:", users);
  useEffect(() => {
    console.log("📡 AdminDashboard mounted");

    if (!socket.connected) {
      console.log("🔌 Connecting socket...");
      socket.connect();
    }

    const currentUser = {
      _id: localStorage.getItem("userId"),
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("userEmail"),
      role: localStorage.getItem("userRole"),
    };

    console.log("👤 Emitting user-online:", currentUser);

    if (currentUser._id) {
      socket.emit("user-online", currentUser);
    }

    const handleOnlineUsers = (usersArray) => {
      console.log("👥 Online users received:", usersArray);
      setOnlineUserIds(usersArray.map((u) => u._id));
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      console.log("❌ AdminDashboard unmounted");
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  console.log("Online User IDs:", onlineUserIds);

  const renderContent = () => {
    if (logsLoading || usersLoading)
      return (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      );

    if (logsError || usersError)
      return (
        <Alert
          type="error"
          message="Error loading data"
          description="There was an error fetching logs or users."
        />
      );

    switch (selectedKey) {
      case "all users":
        return <AdminDashboard />;
      case "onlineusers":
        return <OnlineUsersTable />;
      case "auditlogs":
        return <UserAuditTrailPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", background: "var(--bg-main)" }}
    >
      <SharedSidebar
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={menuItems}
        title="Admin Dashboard"
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: sidebarCollapsed ? 80 : 300,
          transition: "margin-left 0.2s cubic-bezier(0.2, 0, 0, 1) 0s",
          width: `calc(100% - ${sidebarCollapsed ? 80 : 300}px)`
        }}
      >
        <Navbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
          setTheme={setTheme}
        />
        <div
          style={{
            padding: 20,
            flex: 1,
            overflowY: "auto",
            color: "var(--text-main)",
          }}
        >
          {renderContent()}
        </div>

        <CreateUserDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          formData={formData}
          setFormData={setFormData}
          loading={false}
          onCreate={() => {
            console.log("FORM VALUES:", formData);
            setFormData({ name: "", email: "", password: "", role: "rm" });
            setDrawerOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default AdminLayout;
