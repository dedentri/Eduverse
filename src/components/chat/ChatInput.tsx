
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  handleSendMessage: (e: React.FormEvent) => void;
  rounded?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  isListening,
  toggleListening,
  handleSendMessage,
  rounded = true,
}) => (
  <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
    <div className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`w-full px-4 py-3 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm ${
            rounded ? "rounded-full" : ""
          }`}
          placeholder="Type your message..."
        />
        <Button
          type="button"
          onClick={toggleListening}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${rounded ? "rounded-full" : ""} w-8 h-8 flex items-center justify-center ${
            isListening ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
          }`}
          variant="ghost"
          size="icon"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
      </div>
      <Button
        type="submit"
        disabled={!message.trim()}
        variant="default"
        className={`px-6 flex items-center gap-2 shadow-md ${rounded ? "rounded-full" : ""} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700`}
      >
        Send
        <Send size={18} />
      </Button>
    </div>
  </form>
);

