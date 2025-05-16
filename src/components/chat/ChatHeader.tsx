
import React from "react";
import { User } from "@/types";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

interface ChatHeaderProps {
  recipient: User;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient }) => (
  <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50">
    <AvatarPlaceholder name={recipient.name} className="h-10 w-10" />
    <div>
      <h3 className="font-medium">{recipient.name}</h3>
      <p className="text-sm text-gray-500 capitalize">{recipient.role}</p>
    </div>
  </div>
);

