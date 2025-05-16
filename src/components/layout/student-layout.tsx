import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { FileText } from "lucide-react";

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, children, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? "bg-green-100 text-green-900"
        : "text-gray-700 hover:bg-green-50"
    }`}
  >
    {children}
  </Link>
);

export const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-700">EduVerse</h2>
          <p className="text-sm text-gray-500">Student Portal</p>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          <SidebarLink to="/student/dashboard" active={currentPath === "/student/dashboard"}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </SidebarLink>
          <SidebarLink to="/student/ai-chat" active={currentPath === "/student/ai-chat"}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span>AI Chatbot</span>
          </SidebarLink>
          <SidebarLink to="/student/learning-materials" active={currentPath === "/student/learning-materials"}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>Learning Materials</span>
          </SidebarLink>
          <SidebarLink to="/student/chat" active={currentPath === "/student/chat"}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7s8-3.134 8-7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>Chat with Teacher</span>
          </SidebarLink>
          <SidebarLink to="/student/report" active={currentPath === "/student/report"}>
            <FileText className="h-5 w-5" />
            <span>Report</span>
          </SidebarLink>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Student Dashboard</h1>
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
                onClick={logout}
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
