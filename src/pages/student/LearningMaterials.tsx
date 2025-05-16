
import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/layout/student-layout";
import { getDocuments, getSubjects } from "@/lib/data";
import { Document, Subject } from "@/types";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const LearningMaterials = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load subjects and documents on component mount
    setSubjects(getSubjects());
    loadDocuments();
  }, []);

  const loadDocuments = (subjectId?: string) => {
    let allDocuments = getDocuments();
    if (subjectId && subjectId !== "all") {
      allDocuments = allDocuments.filter(doc => doc.subject === subjectId);
    }
    setDocuments(allDocuments);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    loadDocuments(value);
  };

  const handleDownload = (doc: Document) => {
    // In a real app, this would trigger the actual download
    window.open(doc.url, '_blank');
    toast({
      title: "Downloading document",
      description: `The file "${doc.title}" is being downloaded.`
    });
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Uncategorized";
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Learning Materials</h2>
          <p className="text-gray-600 mt-1">
            Access documents uploaded by your teachers
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Subject
              </label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{getSubjectName(doc.subject)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                        doc.fileType === "pdf" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {doc.fileType}
                      </span>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedSubject !== "all"
                  ? "No documents available for this subject."
                  : "Documents are not yet available."}
              </p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default LearningMaterials;
