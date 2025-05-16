export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: Role;
  isActive: boolean;
  profilePic?: string;
  email?: string; // Added email property to the User interface
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

export interface Document {
  id: string;
  teacherId: string;
  title: string;
  fileType: "pdf" | "doc";
  url: string;
  size: number;
  uploadedAt: number;
  subject: string;
}

export interface Activity {
  id: string;
  studentId: string;
  activityType: "chat_ai" | "chat_teacher" | "login" | "logout";
  details?: string;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

export interface ModelConfig {
  modelLink: string;
  accessToken: string;
  chunkSize: number;
  chunkOverlap: number;
  useCpuOrGpu: "CPU" | "GPU";
  returnSourceDocument: boolean;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: number;
}

// Web Speech API TypeScript definitions
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: any;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
