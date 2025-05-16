
import React from "react";
import { StudentLayout } from "@/components/layout/student-layout";
import { AIChatInterface } from "@/components/chat/ai-chat-interface";

const AIChat = () => {
  return (
    <StudentLayout>
      <div className="space-y-6 h-[calc(100vh-180px)]">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI English Tutor</h2>
          <p className="text-gray-600 mt-1">
            Practice your English skills with our AI assistant. You can also use voice input by clicking the microphone icon.
          </p>
        </div>

        <div className="flex-1 h-full">
          <AIChatInterface />
        </div>
      </div>
    </StudentLayout>
  );
};

export default AIChat;
