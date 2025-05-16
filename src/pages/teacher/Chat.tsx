
import React, { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { ChatInterface } from "@/components/chat/chat-interface";
import { User } from "@/types";
import { getUsersByRole } from "@/lib/data";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TeacherChat = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get all active students
    const activeStudents = getUsersByRole("student").filter(
      (student) => student.isActive
    );
    setStudents(activeStudents);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chat with Students</h2>
          <p className="text-gray-600 mt-1">Communicate with your students directly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
          {/* Student List */}
          <div className="bg-white p-4 rounded-xl shadow-md lg:col-span-1 flex flex-col h-full">
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <ul className="space-y-2">
                  {filteredStudents.map((student) => (
                    <li key={student.id}>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className={`w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-gray-50 transition-all ${
                          selectedStudent?.id === student.id 
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm" 
                            : ""
                        }`}
                      >
                        <AvatarPlaceholder name={student.name} className="h-10 w-10" />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.username}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No students found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-xl shadow-md lg:col-span-3 flex flex-col h-full overflow-hidden">
            {selectedStudent ? (
              <ChatInterface recipient={selectedStudent} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gradient-to-b from-white to-blue-50/30 p-8">
                <svg className="w-16 h-16 mb-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-lg font-medium">Select a student to start chatting</p>
                <p className="text-sm mt-2 text-center">Your messages will be private</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherChat;
