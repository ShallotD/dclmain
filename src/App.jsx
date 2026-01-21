// src/App.jsx
import "antd/dist/reset.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ConfigProvider } from "antd";

// 🔌 Socket Provider
import { SocketProvider } from "./components/SocketProvider";
import SessionTimeout from "./components/common/SessionTimeout";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import MainLayout from "./components/creator/COLayout";
import CheckerLayout from "./components/checker/CheckerLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ApproverLayout from "./components/approver/ApproverLayout";
import RmLayout from "./components/rm/RmLayout";

// Styles
import "./App.css";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      {/* 🔌 SOCKET PROVIDER WRAPS ENTIRE APP */}
      <SocketProvider userId={userId}>
        {/* Enforce 15-minute Session Timeout */}
        <SessionTimeout timeoutDuration={15 * 60 * 1000} />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* CO-CREATOR */}
          <Route
            path="/cocreator/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />

          {/* CO-CHECKER */}
          <Route
            path="/cochecker/*"
            element={
              <ProtectedRoute>
                <CheckerLayout />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* APPROVER */}
          <Route
            path="/approver/*"
            element={
              <ProtectedRoute>
                <ApproverLayout userId={userId} />
              </ProtectedRoute>
            }
          />

          {/* RM */}
          <Route
            path="/rm/*"
            element={
              <ProtectedRoute>
                <RmLayout userId={userId} />
              </ProtectedRoute>
            }
          />

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </SocketProvider>
    </ConfigProvider>
  );
};

export default App;
