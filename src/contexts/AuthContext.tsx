
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser,
  setAuth
} from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  redirectAfterLogin: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const redirectAfterLogin = (loggedInUser: User) => {
    if (loggedInUser.role === "admin") {
      navigate("/admin/dashboard");
    } else if (loggedInUser.role === "teacher") {
      navigate("/teacher/dashboard");
    } else if (loggedInUser.role === "student") {
      navigate("/student/dashboard");
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log(`Attempting login with username: ${username}`);
    
    // Try to find user with the provided credentials
    const loggedInUser = loginUser(username, password);
    console.log("Login result:", loggedInUser);
    
    if (loggedInUser) {
      // Check if the user is active
      if (!loggedInUser.isActive) {
        console.log("User account is not active");
        toast({
          title: "Login Error",
          description: "Akun anda tidak aktif. Silahkan hubungi admin.",
          variant: "destructive"
        });
        return false;
      }
      
      // User is found and active, proceed with login
      setAuth({ userId: loggedInUser.id });
      setUser(loggedInUser);
      setIsAuthenticated(true);
      
      // Show success toast
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${loggedInUser.name}!`,
      });
      
      // Redirect after successful login
      redirectAfterLogin(loggedInUser);
      return true;
    }
    
    // User not found or password incorrect
    console.log("Invalid credentials");
    toast({
      title: "Login Error",
      description: "Username atau password salah.",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, redirectAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
