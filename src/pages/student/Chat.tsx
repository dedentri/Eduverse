
import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/layout/student-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { User } from "@/types";
import { getUsersByRole } from "@/lib/data";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const StudentChat = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get all active teachers
    const activeTeachers = getUsersByRole("teacher").filter(
      (teacher) => teacher.isActive
    );
    setTeachers(activeTeachers);

    // Auto-select the first teacher if there's only one
    if (activeTeachers.length === 1) {
      setSelectedTeacher(activeTeachers[0]);
    }
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chat with Teachers</h2>
          <p className="text-gray-600 mt-1">Reach out to your teachers for help and guidance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
          {/* Teacher List */}
          <div className="bg-white p-4 rounded-xl shadow-md lg:col-span-1 flex flex-col h-full">
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-300"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredTeachers.length > 0 ? (
                <ul className="space-y-2">
                  {filteredTeachers.map((teacher) => (
                    <li key={teacher.id}>
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className={`w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-gray-50 transition-all ${
                          selectedTeacher?.id === teacher.id 
                            ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-sm" 
                            : ""
                        }`}
                      >
                        <AvatarPlaceholder name={teacher.name} className="h-10 w-10" />
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-gray-500">Teacher</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No teachers found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-xl shadow-md lg:col-span-3 flex flex-col h-full overflow-hidden">
            {selectedTeacher ? (
              <ChatInterface recipient={selectedTeacher} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gradient-to-b from-white to-green-50/30 p-8">
                <svg className="w-16 h-16 mb-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-lg font-medium">Select a teacher to start chatting</p>
                <p className="text-sm mt-2 text-center">Ask questions about your lessons or get help with assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentChat;
