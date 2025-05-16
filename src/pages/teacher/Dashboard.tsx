
import React from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { useAuth } from "@/contexts/AuthContext";
import { getUsersByRole, getTeacherDocuments, getUnreadChatsCount } from "@/lib/data";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const students = getUsersByRole("student");
  const activeStudents = students.filter(student => student.isActive).length;
  
  const documents = user ? getTeacherDocuments(user.id) : [];
  const unreadChats = user ? getUnreadChatsCount(user.id) : 0;

  const stats = [
    { name: "Total Students", value: students.length },
    { name: "Active Students", value: activeStudents },
    { name: "Documents Uploaded", value: documents.length },
    { name: "Unread Messages", value: unreadChats },
  ];

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Link
                to="/teacher/documents"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Documents
              </Link>
              <Link
                to="/teacher/student-activities"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Student Activities
              </Link>
              <Link
                to="/teacher/chat"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Chat with Students
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Documents
            </h3>
          </div>
          <div className="bg-white">
            <ul className="divide-y divide-gray-200">
              {documents.length > 0 ? (
                documents
                  .sort((a, b) => b.uploadedAt - a.uploadedAt)
                  .slice(0, 5)
                  .map((doc) => (
                    <li key={doc.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg
                              className={`h-8 w-8 ${
                                doc.fileType === "pdf"
                                  ? "text-red-500"
                                  : "text-blue-500"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {doc.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.uploadedAt).toLocaleDateString()} •{" "}
                              {(doc.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${
                              doc.fileType === "pdf"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {doc.fileType}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No documents uploaded yet
                </li>
              )}
            </ul>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Link
              to="/teacher/documents"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all documents <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
