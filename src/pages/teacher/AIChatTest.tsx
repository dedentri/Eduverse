
import React from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { AIChatInterface } from "@/components/chat/ai-chat-interface";

const AIChatTest = () => {
  return (
    <TeacherLayout>
      <div className="space-y-6 h-[calc(100vh-180px)]">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI English Tutor Test</h2>
          <p className="text-gray-600 mt-1">
            Test the AI English tutor functionality before recommending it to students. You can also use voice input by clicking the microphone icon.
          </p>
        </div>

        <div className="flex-1 h-full">
          <AIChatInterface />
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AIChatTest;
