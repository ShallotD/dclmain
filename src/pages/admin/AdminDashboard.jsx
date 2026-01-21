// // import React, { useState } from "react";
// // import {
// //   useGetUsersQuery,
// //   useCreateUserMutation,
// //   useToggleActiveMutation,
// //   useChangeRoleMutation,
// // } from "../../api/userApi.js";

// // import UserTable from "./UserTable.jsx";
// // import CreateUserModal from "./CreateUserModal.jsx";

// // const AdminDashboard = () => {
// //   const { data: users = [], refetch } = useGetUsersQuery();

// //   const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
// //   const [toggleActive] = useToggleActiveMutation();
// //   const [changeRole] = useChangeRoleMutation();

// //   const [openModal, setOpenModal] = useState(false);

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     role: "rm",
// //   });

// //   const handleCreate = async () => {
// //     await createUser(formData);
// //     setFormData({ name: "", email: "", password: "", role: "rm" });
// //     setOpenModal(false);
// //     refetch();
// //   };

// //   const handleToggleActive = async (id) => {
// //     await toggleActive(id);
// //     refetch();
// //   };

// //   const handleChangeRole = async (id, role) => {
// //     await changeRole({ id, role });
// //     refetch();
// //   };

// //   return (
// //     <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">

// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
// //         <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
// //           🏦Admin Control Panel
// //         </h2>

// //         <button
// //           onClick={() => setOpenModal(true)}
// //           className="bg-blue-500 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow"
// //         >
// //           + Create User
// //         </button>
// //       </div>

// //       <p className="text-gray-600 dark:text-gray-300 mb-6">
// //         Manage all users, roles, and account status securely.
// //       </p>

// //       <UserTable
// //         users={users}
// //         onToggleActive={handleToggleActive}
// //         onRoleChange={handleChangeRole}
// //       />

// //       <CreateUserModal
// //         visible={openModal}
// //         loading={isCreating}
// //         formData={formData}
// //         setFormData={setFormData}
// //         onCreate={handleCreate}
// //         onClose={() => setOpenModal(false)}
// //       />
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// import React, { useState } from "react";
// import { Button, message, Card, Space, Typography, Row, Col } from "antd";
// import UserTable from "./UserTable";
// import CreateUserDrawer from "./CreateUserModal";
// // import StatsCards from "./StatsCards";
// // import ActivityLog from "./ActivityLog";
// import {
//   useGetUsersQuery,
//   useCreateUserMutation,
//   useToggleActiveMutation,
//   useChangeRoleMutation,
// } from "../../api/userApi";

// const { Title } = Typography;

// const AdminDashboard = () => {
//   const { data: users = [], isLoading, refetch } = useGetUsersQuery();
//   // const { data: stats = {}, isFetching: statsLoading } =
//   //   useGetAdminStatsQuery();
//   // const { data: logs = [] } = useGetUserLogsQuery(); // recent logss
//   const [createUser] = useCreateUserMutation();
//   const [toggleActive] = useToggleActiveMutation();
//   const [changeRole] = useChangeRoleMutation();
//   // const [deleteUser] = useDeleteUserMutation();

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "customer",
//   });

//   const handleCreateUser = async () => {
//     try {
//       await createUser(formData).unwrap();
//       message.success("User created successfully!");
//       setDrawerOpen(false);
//       setFormData({ name: "", email: "", password: "", role: "customer" });
//       refetch();
//     } catch (err) {
//       message.error(err?.data?.message || "Failed to create user");
//     }
//   };

//   const handleToggleActive = async (id) => {
//     try {
//       await toggleActive(id).unwrap();
//       message.success("User status updated");
//       refetch();
//     } catch (err) {
//       message.error("Failed to update status", err);
//     }
//   };

//   const handleRoleChange = async (id, role) => {
//     try {
//       await changeRole({ id, role }).unwrap();
//       message.success("User role updated");
//       refetch();
//     } catch (err) {
//       message.error("Failed to update role", err);
//     }
//   };

//   // const handleDelete = async (id) => {
//   //   try {
//   //     await deleteUser({ id }).unwrap();
//   //     message.success("User deleted (soft) successfully");
//   //     refetch();
//   //   } catch (err) {
//   //     message.error("Failed to delete user");
//   //   }
//   // };

//   return (
//     <div style={{ padding: 24 }}>
//       <Card
//         style={{
//           marginBottom: 24,
//           borderRadius: 10,
//           boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Space direction="vertical" size="middle" style={{ width: "100%" }}>
//           <Title level={3}>Admin Dashboard</Title>
//           <Row gutter={16}>
//             <Col flex="auto">
//               <Button type="primary" onClick={() => setDrawerOpen(true)}>
//                 Create New User
//               </Button>
//             </Col>
//             <Col>
//               <Button
//                 onClick={() => {
//                   refetch();
//                   message.success("Refreshed");
//                 }}
//               >
//                 Refresh
//               </Button>
//             </Col>
//           </Row>

//           {/* Stats (cards) */}
//           {/* <StatsCards stats={stats} loading={statsLoading} /> */}
//         </Space>
//       </Card>

//       <Card style={{ marginBottom: 24, borderRadius: 10 }}>
//         <UserTable
//           users={users}
//           onToggleActive={handleToggleActive}
//           onRoleChange={handleRoleChange}
//           // onDelete={handleDelete}
//           loading={isLoading}
//         />
//       </Card>

//       {/* <Card style={{ borderRadius: 10 }}>
//         <ActivityLog logs={logs} />
//       </Card> */}

//       <CreateUserDrawer
//         visible={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         formData={formData}
//         setFormData={setFormData}
//         onCreate={handleCreateUser}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   message,
//   Card,
//   Space,
//   Typography,
//   Row,
//   Col,
//   Spin,
//   Empty,
// } from "antd";

// import UserTable from "./UserTable";
// import CreateUserDrawer from "./CreateUserModal";
// import { socket } from "../../app/socket";

// import {
//   useGetUsersQuery,
//   useCreateUserMutation,
//   useToggleActiveMutation,
//   useChangeRoleMutation,
// } from "../../api/userApi";

// const { Title, Text } = Typography;

// const AdminDashboard = () => {
//   /* ================= API HOOKS ================= */
//   const {
//     data: users = [],
//     isLoading,
//     isFetching,
//     refetch,
//   } = useGetUsersQuery();

//   const [createUser, { isLoading: creating }] = useCreateUserMutation();
//   const [toggleActive] = useToggleActiveMutation();
//   const [changeRole] = useChangeRoleMutation();

//   /* ================= LOCAL STATE ================= */
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "rm",
//   });
//   const [onlineUserIds, setOnlineUserIds] = useState([]);

//   /* ================= WEBSOCKET ================= */
//   useEffect(() => {
//     socket.connect();

//     // Build current user object from localStorage
//     const currentUser = {
//       _id: localStorage.getItem("userId"),
//       name: localStorage.getItem("userName"),
//       email: localStorage.getItem("userEmail"),
//       role: localStorage.getItem("userRole"),
//     };

//     // Emit that current user is online
//     if (currentUser._id) socket.emit("userOnline", currentUser);

//     // Listen to online users updates from server
//     const handleOnlineUsers = (usersArray) => {
//       // usersArray = [{ _id, name, lastSeen, ... }]
//       setOnlineUserIds(usersArray.map((u) => u._id));
//     };

//     socket.on("onlineUsers", handleOnlineUsers);

//     return () => {
//       socket.off("onlineUsers", handleOnlineUsers);
//       socket.disconnect();
//     };
//   }, []);

//   /* ================= HANDLERS ================= */
//   const handleCreateUser = async () => {
//     try {
//       await createUser(formData).unwrap();
//       message.success("User created successfully");
//       setDrawerOpen(false);
//       setFormData({ name: "", email: "", password: "", role: "rm" });
//       refetch();
//     } catch (err) {
//       message.error(err?.data?.message || "Failed to create user");
//     }
//   };

//   const handleToggleActive = async (id) => {
//     try {
//       await toggleActive(id).unwrap();
//       message.success("User status updated");
//       refetch();
//     } catch {
//       message.error("Failed to update user status");
//     }
//   };

//   const handleRoleChange = async (id, role) => {
//     try {
//       await changeRole({ id, role }).unwrap();
//       message.success("User role updated");
//       refetch();
//     } catch {
//       message.error("Failed to update user role");
//     }
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div style={{ padding: 24 }}>
//       {/* ===== HEADER CARD ===== */}
//       <Card
//         style={{
//           marginBottom: 24,
//           borderRadius: 10,
//           boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Space direction="vertical" size="middle" style={{ width: "100%" }}>
//           <Title level={3}>Admin Dashboard</Title>
//           <Text type="secondary">Manage users, roles, and account status</Text>

//           <Row gutter={16}>
//             <Col>
//               <Button type="primary" onClick={() => setDrawerOpen(true)}>
//                 Create New User
//               </Button>
//             </Col>
//             <Col>
//               <Button onClick={refetch} loading={isFetching}>
//                 Refresh
//               </Button>
//             </Col>
//           </Row>
//         </Space>
//       </Card>

//       {/* ===== USERS TABLE ===== */}
//       <Card style={{ marginBottom: 24, borderRadius: 10 }}>
//         {isLoading ? (
//           <div style={{ padding: 40, textAlign: "center" }}>
//             <Spin size="large" />
//           </div>
//         ) : users.length === 0 ? (
//           <Empty description="No users found" />
//         ) : (
//           <UserTable
//             users={users.map((u) => ({
//               ...u,
//               _id: u._id || u.id, // normalize id
//               isOnline: onlineUserIds.includes(u._id || u.id), // mark online status
//             }))}
//             loading={isFetching}
//             onToggleActive={handleToggleActive}
//             onRoleChange={handleRoleChange}
//           />
//         )}
//       </Card>

//       {/* ===== CREATE USER DRAWER ===== */}
//       <CreateUserDrawer
//         visible={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         formData={formData}
//         setFormData={setFormData}
//         onCreate={handleCreateUser}
//         loading={creating}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import {
  Button,
  message,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
} from "antd";

import UserTable from "./UserTable";
import CreateUserDrawer from "./CreateUserModal";

// ✅ IMPORTANT: default import (single socket instance)
import socket from "../../app/socket";

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useToggleActiveMutation,
  useChangeRoleMutation,
} from "../../api/userApi";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  /* ================= API HOOKS ================= */
  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetUsersQuery();

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [toggleActive] = useToggleActiveMutation();
  const [changeRole] = useChangeRoleMutation();

  /* ================= LOCAL STATE ================= */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "rm",
  });

  const [onlineUserIds, setOnlineUserIds] = useState([]);

  /* ================= SOCKET.IO ================= */
  useEffect(() => {
    // ✅ Connect once (safe for React 18)
    if (!socket.connected) {
      socket.connect();
    }

    // Build logged-in user from localStorage
    const currentUser = {
      _id: localStorage.getItem("userId"),
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("userEmail"),
      role: localStorage.getItem("userRole"),
    };

    // Emit online status
    if (currentUser._id) {
      socket.emit("userOnline", currentUser);
    }

    // Listen for online users from server
    const handleOnlineUsers = (usersArray) => {
      // usersArray = [{ _id, name, role, lastSeen }]
      setOnlineUserIds(usersArray.map((u) => u._id));
    };

    socket.on("onlineUsers", handleOnlineUsers);

    // ❗ DO NOT DISCONNECT SOCKET HERE
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  /* ================= HANDLERS ================= */
  const handleCreateUser = async () => {
    try {
      await createUser(formData).unwrap();
      message.success("User created successfully");

      setDrawerOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "rm",
      });

      refetch();
    } catch (err) {
      message.error(err?.data?.message || "Failed to create user");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleActive(id).unwrap();
      message.success("User status updated");
      refetch();
    } catch {
      message.error("Failed to update user status");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await changeRole({ id, role }).unwrap();
      message.success("User role updated");
      refetch();
    } catch {
      message.error("Failed to update user role");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div style={{ padding: 24 }}>
      {/* ===== HEADER ===== */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3}>Admin Dashboard</Title>
          <Text type="secondary">Manage users, roles, and online presence</Text>

          <Row gutter={12}>
            <Col>
              <Button type="primary" onClick={() => setDrawerOpen(true)}>
                Create New User
              </Button>
            </Col>
            <Col>
              <Button onClick={refetch} loading={isFetching}>
                Refresh
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* ===== USERS TABLE ===== */}
      <Card style={{ borderRadius: 10 }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : users.length === 0 ? (
          <Empty description="No users found" />
        ) : (
          <UserTable
            users={users.map((u) => {
              const id = u._id || u.id;
              return {
                ...u,
                _id: id,
                isOnline: onlineUserIds.includes(id),
              };
            })}
            loading={isFetching}
            onToggleActive={handleToggleActive}
            onRoleChange={handleRoleChange}
          />
        )}
      </Card>

      {/* ===== CREATE USER DRAWER ===== */}
      <CreateUserDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreateUser}
        loading={creating}
      />
    </div>
  );
};

export default AdminDashboard;
