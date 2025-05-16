import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getModelConfig, addActivity } from "@/lib/data";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { format } from "date-fns";
import { Mic, MicOff } from "lucide-react";
import { SpeechRecognition } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export const AIChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your English assistant. I am an assistant programmed to help you organize good and correct grammar. How can I help you practice today? You can ask me about grammar, vocabulary, or practice conversation.",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
      
        // Kapitalisasi huruf pertama
        const capitalizedTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      
        setMessage(capitalizedTranscript);
      };
      

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (message.trim() && user) {
      const userMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content: message.trim(),
        timestamp: Date.now(),
      };
  
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage("");
      setIsLoading(true);
  
      // Log this activity
      if (user.role === "student") {
        addActivity({
          studentId: user.id,
          activityType: "chat_ai",
          details: message.trim().substring(0, 50) + (message.length > 50 ? "..." : ""),
        });
      }
  
      try {
        // === Ganti ke request ke backend FastAPI ===
        const response = await fetch("https://f43f-34-138-95-63.ngrok-free.app/check_grammar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: userMessage.content }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }
  
        const data = await response.json();
  
        // Bangun pesan AI dari data grammar checker
        let aiResponse = `🔍 Found ${data.issues_found} issue(s).\n`;
        data.details.forEach((issue: any, index: number) => {
          aiResponse += `\n${index + 1}. Error: ${issue.error}\nSuggestion: ${issue.suggestions.join(", ") || "No suggestions"}\nContext: "${issue.context}"\n`;
        });
        aiResponse += `\n🧠 Grammar Score: ${data.grammar_score}/100`;
  
        const aiMessage = {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: aiResponse,
          timestamp: Date.now(),
        };
  
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error(error);
        const errorMessage = {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: "❗ Oops! Failed to connect to the grammar checker service.",
          timestamp: Date.now(),
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "h:mm a");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium">AI English Tutor</h3>
          <p className="text-sm text-gray-500">Always here to help you learn</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2">
                  {!isUser && (
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-indigo-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {isUser && user && (
                    <AvatarPlaceholder
                      name={user.name}
                      className="h-8 w-8 mb-1"
                    />
                  )}
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-indigo-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ask your English learning question..."
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
