
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { getSubjects, addSubject, deleteSubject } from "@/lib/data";
import { Subject } from "@/types";
import { useToast } from "@/hooks/use-toast";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = () => {
    setSubjects(getSubjects());
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates
    if (subjects.some(subject => subject.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      toast({
        title: "Error",
        description: "This subject already exists",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    
    // Add the subject
    setTimeout(() => {
      try {
        const newSubject = addSubject(newSubjectName.trim());
        setSubjects([...subjects, newSubject]);
        setNewSubjectName("");
        toast({
          title: "Subject Added",
          description: `${newSubjectName} has been added successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add subject",
          variant: "destructive",
        });
      } finally {
        setIsAdding(false);
      }
    }, 500);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the subject "${name}"? This will affect all related documents.`)) {
      deleteSubject(id);
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast({
        title: "Subject Deleted",
        description: `${name} has been deleted`,
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
          <p className="text-gray-600 mt-1">Add and manage subject categories for learning materials</p>
        </div>

        {/* Add New Subject */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Subject</h3>
          <form onSubmit={handleAddSubject} className="flex items-start space-x-4">
            <div className="flex-1">
              <label htmlFor="subject-name" className="block text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <input
                type="text"
                id="subject-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter subject name"
                disabled={isAdding}
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Subject"}
            </button>
          </form>
        </div>

        {/* Subject List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Subject Categories
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Categories for organizing learning materials
            </p>
          </div>
          
          {subjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subject Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subject.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subject.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteSubject(subject.id, subject.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first subject.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubjectManagement;
