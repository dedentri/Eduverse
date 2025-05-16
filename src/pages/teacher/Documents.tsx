import React, { useState, useEffect, useRef } from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { useAuth } from "@/contexts/AuthContext";
import { Document, Subject } from "@/types";
import { Edit, Download, Trash2, Search, Upload, FileText, FolderOpen } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  getTeacherDocuments, 
  addDocument, 
  deleteDocument, 
  getSubjects,
  updateDocument,
  getDocumentsBySubject
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<Document[]>(
    user ? getTeacherDocuments(user.id) : []
  );
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDoc, setEditingDoc] = useState<{ id: string, title: string } | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    setSubjects(getSubjects());
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || doc.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : "Uncategorized";
  };

  const handleDelete = (doc: Document) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(doc.id);
      setDocuments(prevDocs => prevDocs.filter(d => d.id !== doc.id));
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    }
  };

  const handleDownload = (doc: Document) => {
    window.open(doc.url, '_blank');
    toast({
      title: "Downloading document",
      description: "Your document is being downloaded.",
    });
  };

  const handleRename = (docId: string, newTitle: string) => {
    const updatedDoc = updateDocument(docId, { title: newTitle });
    if (updatedDoc) {
      setDocuments(prevDocs => 
        prevDocs.map(doc => doc.id === docId ? { ...doc, title: newTitle } : doc)
      );
      setEditingDoc(null);
      toast({
        title: "Document renamed",
        description: "The document has been successfully renamed.",
      });
    }
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
  };

  const formSchema = z.object({
    title: z.string().min(1, "Document title is required"),
    subject: z.string().min(1, "Subject is required"),
    file: z.any().refine((file) => !!file, "File is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      file: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0]);
      if (!form.getValues().title) {
        const fileName = e.target.files[0].name.split('.').slice(0, -1).join('.');
        form.setValue("title", fileName);
      }
    }
  };

  // Function to open file explorer
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    const file = values.file as File;
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || "";
    
    let fileType: "pdf" | "doc";
    if (fileExtension === "pdf") {
      fileType = "pdf";
    } else {
      fileType = "doc";
    }
    
    const fakeUrl = URL.createObjectURL(file);
    
    const newDoc: Omit<Document, 'id' | 'uploadedAt'> = {
      title: values.title,
      teacherId: user.id,
      subject: values.subject,
      url: fakeUrl,
      fileType: fileType,
      size: file.size,
    };
    
    const addedDoc = addDocument(newDoc);
    if (addedDoc) {
      setDocuments(prev => [...prev, addedDoc]);
      toast({
        title: "Document uploaded",
        description: `"${values.title}" has been successfully uploaded to ${getSubjectName(values.subject)}.`,
      });
      setUploadDialogOpen(false);
      form.reset();
    }
  };

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Learning Materials</h2>
            <p className="text-gray-600 mt-1">
              Manage your uploaded learning materials
            </p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Learning Material</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter document title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white shadow-md rounded-md">
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id}
                                className="text-black"
                              >
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Document File</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2 transition"
                            >
                              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="flex-1 overflow-x-auto whitespace-nowrap text-sm text-gray-700">
                                {value ? (value as File).name : "Select a file"}
                              </span>
                            </label>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                }
                              }}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setUploadDialogOpen(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Upload</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Document List</TabsTrigger>
            <TabsTrigger value="folders">Subject Folders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {filteredDocuments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          {editingDoc?.id === doc.id ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="p-0 h-auto">
                                  {doc.title}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rename Document</DialogTitle>
                                </DialogHeader>
                                <Input
                                  value={editingDoc.title}
                                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                                  className="mt-4"
                                />
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline" onClick={() => setEditingDoc(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleRename(doc.id, editingDoc.title)}>
                                    Save
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            doc.title
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                            doc.fileType === "pdf" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {doc.fileType}
                          </span>
                        </TableCell>
                        <TableCell>{getSubjectName(doc.subject)}</TableCell>
                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDoc({ id: doc.id, title: doc.title })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "No documents match your search criteria."
                      : "Get started by uploading your first document."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="folders" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const subjectDocs = getDocumentsBySubject(subject.id);
                return (
                  <div 
                    key={subject.id} 
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FolderOpen className={`h-10 w-10 ${subjectDocs.length > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="font-medium">{subject.name}</h3>
                        <p className="text-sm text-gray-500">{subjectDocs.length} documents</p>
                      </div>
                    </div>
                    
                    {subjectDocs.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {subjectDocs.slice(0, 3).map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{doc.title}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {subjectDocs.length > 3 && (
                          <div className="text-center mt-2">
                            <span className="text-xs text-blue-500">
                              +{subjectDocs.length - 3} more documents
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 text-center text-sm text-gray-500">No documents</div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  );
};

export default Documents;
