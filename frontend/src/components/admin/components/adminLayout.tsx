import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectAdminAuthData } from "../../../store/selectors";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps): React.JSX.Element => {
  const { adminData } = useSelector(selectAdminAuthData);
  const userId = adminData?.id;
  const token = adminData?.token;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userId || !token) return;
    const socket = io( import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", userId);
    });

    socket.on("new_chat_notification", (notification: any) => {
     

      const toastId = `notification_${notification._id}`;
      if (!toast.isActive(toastId)) {
        toast.info(
          <div
            style={{
              padding: "12px 16px",
              borderLeft: "4px solid #0d6efd",
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#333",
                marginBottom: "4px",
              }}
            >
              📩 New Message Notification
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              You have received a message from: <strong>Coordinator</strong>
            </div>
          </div>,
          {
            toastId,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      }
    });

    socket.on("disconnect", () => {
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 shadow-lg z-50
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 lg:ml-72 pt-16 p-6 overflow-auto">
          <Outlet />
          {children}
        </main>
        <ToastContainer limit={1} />
      </div>
    </div>
  );
};

export default AdminLayout;
