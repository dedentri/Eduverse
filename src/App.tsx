
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Documents from "./pages/teacher/Documents";
import StudentActivities from "./pages/teacher/StudentActivities";
import Chat from "./pages/Chat";
import Report from "./pages/teacher/Report";
import StudentReportPage from "./pages/student/Report";
import AIChat from "./pages/student/AIChat";
import { AdminLayout } from "./components/layout/admin-layout";
import SubjectManagement from "./pages/admin/SubjectManagement";
import UserManagement from "./pages/admin/UserManagement";
import LearningMaterials from "./pages/student/LearningMaterials";
import AIChatTest from "./pages/teacher/AIChatTest";
import ModelConfig from "./pages/admin/ModelConfig";
import AdminReport from "./pages/admin/Report";
import { User } from "@/types";
import { Toaster } from "./components/ui/toaster";
import { SettingsButton } from "./components/settings/SettingsButton";

// This component needs to be inside Router context
const AuthenticatedApp = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Handle redirection based on user role
  React.useEffect(() => {
    if (user && isAuthenticated) {
      console.log("AuthenticatedApp: User is authenticated with role:", user.role);
      // Only do initial redirect if we're at the root
      if (window.location.pathname === "/" || window.location.pathname === "/login") {
        // Redirect based on role
        if (user.role === "admin") {
          console.log("Redirecting to admin dashboard");
          navigate("/admin/dashboard");
        } else if (user.role === "teacher") {
          console.log("Redirecting to teacher dashboard");
          navigate("/teacher/dashboard");
        } else if (user.role === "student") {
          console.log("Redirecting to student dashboard");
          navigate("/student/dashboard");
        }
      } else {
        console.log("Not redirecting, current path is:", window.location.pathname);
      }
    }
  }, [navigate, user, isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/documents"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <Documents />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/student-activities"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <StudentActivities />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/report"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <Report />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/ai-chat-test"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <AIChatTest />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher/chat"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <Chat />
            </RequireAuth>
          }
        />
        
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <StudentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/student/report"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <StudentReportPage />
            </RequireAuth>
          }
        />
        <Route
          path="/student/ai-chat"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <AIChat />
            </RequireAuth>
          }
        />
        <Route
          path="/student/learning-materials"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <LearningMaterials />
            </RequireAuth>
          }
        />
        <Route
          path="/student/chat"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <Chat />
            </RequireAuth>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <UserManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/subject-management"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <SubjectManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/model-config"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ModelConfig />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/report"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminReport />
            </RequireAuth>
          }
        />
        
        {/* Redirect to login if accessing the root */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <SettingsButton />
      <Toaster />
    </>
  );
};

const RequireAuth = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user } = useAuth();
  console.log("RequireAuth checking user:", user, "for allowed roles:", allowedRoles);

  if (!user) {
    console.log("No user, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("User role not allowed, redirecting to unauthorized");
    return <Navigate to="/unauthorized" />;
  }

  console.log("Access granted for user with role:", user.role);
  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
};

export default App;
