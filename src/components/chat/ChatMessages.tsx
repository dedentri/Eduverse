
import React, { useRef, useEffect } from "react";
import { Chat, User } from "@/types";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface ChatMessagesProps {
  chats: Chat[];
  user: User;
  recipient: User;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  chats, 
  user, 
  recipient,
  onDeleteMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "h:mm a");
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50">
      <div className="space-y-4">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          chats.map((chat) => {
            const isSender = chat.senderId === user.id;
            return (
              <div
                key={chat.id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 group">
                  {!isSender && (
                    <AvatarPlaceholder
                      name={recipient.name}
                      className="h-8 w-8 mb-1"
                    />
                  )}
                  <div className="relative">
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                        isSender
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none dark:from-blue-600 dark:to-blue-700"
                          : "bg-gray-100 text-gray-800 rounded-tl-none dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{chat.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSender ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatTime(chat.timestamp)}
                      </p>
                    </div>
                    {isSender && onDeleteMessage && (
                      <button 
                        onClick={() => onDeleteMessage(chat.id)}
                        className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Delete message"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {isSender && (
                    <AvatarPlaceholder
                      name={user.name}
                      className="h-8 w-8 mb-1"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
