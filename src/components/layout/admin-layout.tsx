
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Enhanced logging to debug navigation issues
  console.log("AdminLayout rendering with path:", currentPath);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-700">EduVerse</h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {/* Dashboard */}
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPath === "/admin/dashboard"
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </Link>
          
          {/* User Management */}
          <Link 
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPath === "/admin/users"
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>Manajemen Pengguna</span>
          </Link>
          
          {/* Model Configuration */}
          <Link 
            to="/admin/model-config"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPath === "/admin/model-config"
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Konfigurasi Model</span>
          </Link>
          
          {/* Reports */}
          <Link 
            to="/admin/report"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPath === "/admin/report"
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
            </svg>
            <span>Laporan</span>
          </Link>
          
          {/* Subject Management */}
          <Link 
            to="/admin/subject-management"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPath === "/admin/subject-management"
                ? "bg-purple-100 text-purple-900"
                : "text-gray-700 hover:bg-purple-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Manajemen Mata Pelajaran</span>
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user && (
                  <AvatarPlaceholder name={user.name} className="h-8 w-8 text-sm" />
                )}
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
