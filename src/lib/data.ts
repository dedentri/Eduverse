
import { User, Chat, ChatMessage, Message, Document, Activity, ModelConfig } from "@/types";

// Users
const usersKey = "users";

export const getAllUsers = (): User[] => {
  const users = localStorage.getItem(usersKey);
  return users ? JSON.parse(users) : [];
};

export const getUsersByRole = (role: string): User[] => {
  const users = getAllUsers();
  return users.filter((user) => user.role === role);
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find((user) => user.id === id);
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = getAllUsers();
  const updatedUsers = users.map((user) =>
    user.id === id ? { ...user, ...updates } : user
  );
  localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
  
  // Retrieve and return the updated user
  return updatedUsers.find(user => user.id === id);
};

// Authentication
const authKey = "auth";

export const getAuth = () => {
  const auth = localStorage.getItem(authKey);
  return auth ? JSON.parse(auth) : null;
};

export const setAuth = (auth: any) => {
  localStorage.setItem(authKey, JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem(authKey);
};

// Chats
const chatsKey = "chats";

export const getChats = (): Chat[] => {
  const chats = localStorage.getItem(chatsKey);
  return chats ? JSON.parse(chats) : [];
};

export const getChatById = (id: string): Chat | undefined => {
  const chats = getChats();
  return chats.find((chat) => chat.id === id);
};

export const getChatsForUser = (userId: string): Chat[] => {
  const chats = getChats();
  return chats.filter(
    (chat) => chat.senderId === userId || chat.receiverId === userId
  );
};

export const addChat = (chat: Omit<Chat, "id" | "timestamp" | "isRead">): Chat => {
  const chats = getChats();
  const newChat = {
    ...chat,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
    isRead: false,
    messages: [] as ChatMessage[],
  };
  chats.push(newChat);
  localStorage.setItem(chatsKey, JSON.stringify(chats));
  return newChat;
};

// Messages
export const addMessageToChat = (chatId: string, messageData: { senderId: string; receiverId: string; message: string; }): Message => {
  const chats = getChats();
  const chat = chats.find((chat) => chat.id === chatId);
  
  const newMessage = { 
    id: Math.random().toString(36).substring(2, 9),
    ...messageData,
    timestamp: Date.now(),
    isRead: false
  };
  
  if (!chat) {
    // Create a new chat with this message
    const newChat: Chat = {
      id: chatId || Math.random().toString(36).substring(2, 9),
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      timestamp: Date.now(),
      isRead: false,
      messages: [newMessage]
    };
    chats.push(newChat);
  } else if (chat.messages) {
    // Add message to existing chat that has messages array
    chat.messages.push(newMessage);
  } else {
    // For backward compatibility, ensure messages array exists
    chat.messages = [newMessage];
  }
  
  localStorage.setItem(chatsKey, JSON.stringify(chats));
  return newMessage;
};

// Clear all chat messages
export const clearChat = (chatId: string): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  
  if (chatIndex !== -1) {
    chats[chatIndex].messages = [];
    localStorage.setItem(chatsKey, JSON.stringify(chats));
  }
};

// Delete a single message
export const deleteMessage = (chatId: string, messageId: string): void => {
  const chats = getChats();
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  
  if (chatIndex !== -1 && chats[chatIndex].messages) {
    chats[chatIndex].messages = chats[chatIndex].messages.filter(
      (message) => message.id !== messageId
    );
    localStorage.setItem(chatsKey, JSON.stringify(chats));
  }
};

export const getUnreadChatsCount = (userId: string): number => {
  const chats = getChats();
  let count = 0;
  chats.forEach(chat => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage && lastMessage.senderId !== userId && !lastMessage.isRead) {
        count++;
      }
    } else if (chat.receiverId === userId && !chat.isRead) {
      // Legacy format
      count++;
    }
  });
  return count;
};

// Documents
const documentsKey = "documents";

export const getDocuments = (): Document[] => {
  const documents = localStorage.getItem(documentsKey);
  return documents ? JSON.parse(documents) : [];
};

export const getTeacherDocuments = (teacherId: string): Document[] => {
  const documents = getDocuments();
  return documents.filter((doc) => doc.teacherId === teacherId);
};

export const deleteDocument = (id: string) => {
  const documents = getDocuments();
  const updatedDocuments = documents.filter((doc) => doc.id !== id);
  localStorage.setItem(documentsKey, JSON.stringify(updatedDocuments));
};

export const updateDocument = (id: string, updates: Partial<Document>): Document | undefined => {
  const documents = getDocuments();
  const updatedDocuments = documents.map(doc =>
    doc.id === id ? { ...doc, ...updates } : doc
  );
  localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  return updatedDocuments.find(doc => doc.id === id);
};

// Reports
const reportsKey = "reports";

export interface Report {
  senderName: string;
  senderId: string;
  senderRole: string;
  message: string;
  isRead?: boolean;
  timestamp?: number;
}

export const getReports = (): Report[] => {
  const reports = localStorage.getItem(reportsKey);
  return reports ? JSON.parse(reports) : [];
};

export const addReport = (report: Report) => {
  const reports = getReports();
  const newReport = {
    ...report,
    timestamp: Date.now(),
    isRead: false
  };
  reports.push(newReport);
  localStorage.setItem(reportsKey, JSON.stringify(reports));
  return newReport;
};

// Initialize users in localStorage if not exists
if (typeof localStorage !== 'undefined' && !localStorage.getItem(usersKey)) {
  const initialUsers = [
    {
      id: "1",
      username: "john.doe",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "teacher",
      isActive: true,
    },
    {
      id: "2",
      username: "jane.smith",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password",
      role: "student",
      isActive: true,
    },
    {
      id: "3",
      username: "admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "password",
      role: "admin",
      isActive: true,
    },
  ];
  localStorage.setItem(usersKey, JSON.stringify(initialUsers));
}

// Initialize subjects in localStorage if not exists
if (typeof localStorage !== 'undefined' && !localStorage.getItem('subjects')) {
  const defaultSubjects = [
    { id: '1', name: 'Bahasa Inggris', createdAt: Date.now() },
    { id: '2', name: 'Bahasa Indonesia', createdAt: Date.now() },
    { id: '3', name: 'Kejuruan', createdAt: Date.now() },
    { id: '4', name: 'BK', createdAt: Date.now() },
    { id: '5', name: 'PKDK', createdAt: Date.now() },
    { id: '6', name: 'Bahasa Jawa', createdAt: Date.now() },
    { id: '7', name: 'Matematika', createdAt: Date.now() },
    { id: '8', name: 'PPKN', createdAt: Date.now() }
  ];
  localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
}

// Get all subjects
export const getSubjects = () => {
  const subjects = localStorage.getItem('subjects');
  return subjects ? JSON.parse(subjects) : [];
};

// Add new subject
export const addSubject = (name: string) => {
  const subjects = getSubjects();
  const newSubject = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    createdAt: Date.now(),
  };
  
  subjects.push(newSubject);
  localStorage.setItem('subjects', JSON.stringify(subjects));
  return newSubject;
};

// Delete subject
export const deleteSubject = (id: string) => {
  const subjects = getSubjects();
  const updatedSubjects = subjects.filter((subject: any) => subject.id !== id);
  localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
};

// Update document to include subject
export const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt'>) => {
  const documents = getDocuments();
  const newDocument = {
    ...doc,
    id: Math.random().toString(36).substring(2, 9),
    uploadedAt: Date.now(),
  };
  
  documents.push(newDocument);
  localStorage.setItem('documents', JSON.stringify(documents));
  return newDocument;
};

// Get documents by subject
export const getDocumentsBySubject = (subjectId: string) => {
  const documents = getDocuments();
  return documents.filter((doc: Document) => doc.subject === subjectId);
};

export const getCurrentUser = () => {
  const auth = getAuth();
  return auth ? getUserById(auth.userId) : null;
};

export const loginUser = (username: string, password: string) => {
  console.log(`Looking for user with username: ${username}`);
  const users = getAllUsers();
  console.log(`Found ${users.length} users`);
  
  // Find the user with the provided username and password
  const user = users.find(u => u.username === username && u.password === password);
  
  // Log whether we found a user and their active status if found
  if (user) {
    console.log(`Found user: ${user.name}, role: ${user.role}, active: ${user.isActive}`);
    return user;
  } else {
    console.log(`No user found with username: ${username}`);
    return null;
  }
};

export const logoutUser = () => {
  clearAuth();
};

export const markReportAsRead = (index: number) => {
  const reports = getReports();
  if (reports[index]) {
    reports[index].isRead = true;
    localStorage.setItem(reportsKey, JSON.stringify(reports));
  }
};

export const getUsers = () => {
  return getAllUsers();
};

export const addUser = (user: Partial<User>) => {
  const users = getAllUsers();
  const newUser = {
    ...user,
    id: Math.random().toString(36).substring(2, 9),
  } as User;
  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));
  return newUser;
};

export const deleteUser = (id: string) => {
  const users = getAllUsers();
  const updatedUsers = users.filter(user => user.id !== id);
  localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
};

export const toggleUserActiveStatus = (id: string) => {
  const users = getAllUsers();
  const updatedUsers = users.map(user => 
    user.id === id ? { ...user, isActive: !user.isActive } : user
  );
  localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
};

export const getStudentActivities = () => {
  const activities = localStorage.getItem('activities');
  return activities ? JSON.parse(activities) : [];
};

export const getModelConfig = (): ModelConfig => {
  const config = localStorage.getItem('modelConfig');
  return config ? JSON.parse(config) : {
    modelLink: '',
    accessToken: '',
    chunkSize: 500,
    chunkOverlap: 50,
    useCpuOrGpu: 'CPU',
    returnSourceDocument: false
  };
};

export const updateModelConfig = (config: Partial<ModelConfig>) => {
  const currentConfig = getModelConfig();
  const updatedConfig = { ...currentConfig, ...config };
  localStorage.setItem('modelConfig', JSON.stringify(updatedConfig));
};

export const markChatAsRead = (chatId: string, userId: string) => {
  const chats = getChats();
  const updatedChats = chats.map(chat => {
    if (chat.id === chatId) {
      return { ...chat, isRead: true };
    }
    return chat;
  });
  localStorage.setItem(chatsKey, JSON.stringify(updatedChats));
};

export const getChatsBetweenUsers = (user1Id: string, user2Id: string) => {
  const chats = getChats();
  return chats.filter(chat => 
    (chat.senderId === user1Id && chat.receiverId === user2Id) ||
    (chat.senderId === user2Id && chat.receiverId === user1Id)
  );
};

export const addActivity = (activityData: Partial<Activity>) => {
  const activities = getStudentActivities();
  const newActivity = {
    ...activityData,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now()
  } as Activity;
  activities.push(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities));
  return newActivity;
};
