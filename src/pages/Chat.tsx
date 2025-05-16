
import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { StudentLayout } from '@/components/layout/student-layout';
import { ChatInterface } from '@/components/chat/chat-interface';
import { getUsersByRole } from '@/lib/data';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Chat = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Determine which type of users to fetch based on current user
    const fetchUsers = async () => {
      if (user) {
        let users: User[] = [];
        if (user.role === 'teacher') {
          // Teachers see students
          users = getUsersByRole('student').filter(u => u.isActive);
        } else if (user.role === 'student') {
          // Students see teachers
          users = getUsersByRole('teacher').filter(u => u.isActive);
        }
        
        setAvailableUsers(users);
        
        // Auto-select the first user if available
        if (users.length > 0) {
          setSelectedUser(users[0]);
        }
      }
    };
    
    fetchUsers();
  }, [user]);

  // Filter users based on search term
  const filteredUsers = availableUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use the appropriate layout based on user role
  const Layout = user?.role === 'student' ? StudentLayout : TeacherLayout;

  if (!user) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Chat with {user.role === 'student' ? 'Teachers' : 'Students'}
          </h2>
          <p className="text-gray-600 mt-1">
            {user.role === 'student' 
              ? 'Reach out to your teachers for help and guidance'
              : 'Connect with your students to provide support'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
          {/* Users List */}
          <div className="bg-white p-4 rounded-xl shadow-md lg:col-span-1 flex flex-col h-full">
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder={`Search ${user.role === 'student' ? 'teachers' : 'students'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                <ul className="space-y-2">
                  {filteredUsers.map((u) => (
                    <li key={u.id}>
                      <button
                        onClick={() => setSelectedUser(u)}
                        className={`w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-gray-50 transition-all ${
                          selectedUser?.id === u.id 
                            ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm" 
                            : ""
                        }`}
                      >
                        <AvatarPlaceholder name={u.name} className="h-10 w-10" />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No {user.role === 'student' ? 'teachers' : 'students'} found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-xl shadow-md lg:col-span-3 flex flex-col h-full overflow-hidden">
            {selectedUser ? (
              <ChatInterface recipient={selectedUser} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gradient-to-b from-white to-green-50/30 p-8">
                <svg className="w-16 h-16 mb-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-lg font-medium">
                  Select a {user.role === 'student' ? 'teacher' : 'student'} to start chatting
                </p>
                <p className="text-sm mt-2 text-center">
                  {user.role === 'student' 
                    ? 'Ask questions about your lessons or get help with assignments'
                    : 'Help students with their questions or provide guidance'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
