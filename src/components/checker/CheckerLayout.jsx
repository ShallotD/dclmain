// export default CheckerLayout;
import React, { useState } from "react";
import { Menu } from "antd";
import { Inbox, CheckCircle, BarChart2 } from "lucide-react";
import { useSelector } from "react-redux";

import Navbar from "../Navbar";

// Pages
import AllChecklists from "../../pages/checker/allChecklists";
import CompletedChecklists from "../../pages/checker/Completed";
import Reportss from "../../pages/creator/Reports";

import SharedSidebar from "../common/SharedSidebar";
import Deferrals from "../../pages/checker/Deferral";

const CheckerLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [selectedKey, setSelectedKey] = useState("myQueue");
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 300;

  const menuItems = [
    {
      key: "myQueue",
      icon: <Inbox size={18} />,
      label: "My Queue",
    },
    {
      key: "completed",
      icon: <CheckCircle size={18} />,
      label: "Completed",
    },

    {
      key: "deferrals",
      icon: <BarChart2 size={18} />,
      label: "Deferrals",
    },
    {
      key: "reports",
      icon: <BarChart2 size={18} />,
      label: "Reports",
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "myQueue":
        return <AllChecklists userId={userId} />;
      case "completed":
        return <CompletedChecklists userId={userId} />;

      case "deferrals":
        return <Deferrals userId={userId} />;
      case "reports":
        return <Reportss />;

      default:
        return <AllChecklists userId={userId} />;
    }
  };

  return (
    <>
      {/* Shared Sidebar */}
      <SharedSidebar
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
        menuItems={menuItems}
        title="CO Checker"
      />

      {/* MAIN AREA */}
      <div
        style={{
          marginLeft: sidebarWidth,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f0f2f5",
        }}
      >
        {/* NAVBAR (STICKY) */}
        <div
          style={{
            position: "sticky",

            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Navbar />
        </div>

        {/* CONTENT (SCROLLS) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
          }}
        >
          {renderContent()}
        </div>

        {/* FOOTER (STICKY) */}
        <footer
          style={{
            position: "sticky",
            bottom: 0,
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "10px 20px",
            textAlign: "center",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          © {new Date().getFullYear()} NCBA Bank PLC. All Rights Reserved.
        </footer>
      </div>
    </>
  );
};

export default CheckerLayout;
