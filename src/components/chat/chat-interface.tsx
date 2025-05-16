
import { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { addMessageToChat, getChatById, getChatsBetweenUsers, clearChat, deleteMessage } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ChatProps {
  recipient: User;
}

export const ChatInterface = ({ recipient }: ChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Generate a stable chat ID between users
  const getChatId = () => {
    if (!user) return '';
    // Sort IDs to ensure same ID regardless of who initiated the chat
    const sortedIds = [user.id, recipient.id].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
  };

  const chatId = getChatId();

  useEffect(() => {
    if (chatId) {
      loadChatMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [chatId]);

  // Add real-time polling for messages
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (chatId) {
        loadChatMessages();
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [chatId]);

  const loadChatMessages = () => {
    setLoading(true);
    try {
      if (!user) return;
      
      // Get all messages between these two users
      const chats = getChatsBetweenUsers(user.id, recipient.id);
      
      if (chats && chats.length > 0) {
        // Find chat with messages
        const chatWithMessages = chats.find(chat => chat.messages && chat.messages.length > 0);
        
        if (chatWithMessages && chatWithMessages.messages) {
          setMessages(chatWithMessages.messages);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading chat messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    try {
      if (!user) return;
      clearChat(chatId);
      setMessages([]);
      toast({
        title: "Chat cleared",
        description: "All messages have been deleted",
      });
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast({
        title: "Error",
        description: "Could not clear chat",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    try {
      if (!user) return;
      deleteMessage(chatId, messageId);
      loadChatMessages();
      toast({
        description: "Message deleted",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Could not delete message",
        variant: "destructive",
      });
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      addMessageToChat(chatId, {
        senderId: user.id,
        receiverId: recipient.id,
        message: message
      });
      
      setMessage('');
      loadChatMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <ChatHeader recipient={recipient} />
      <div className="flex items-center justify-end px-4 py-1 bg-gray-50 dark:bg-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-xs">Clear chat</span>
        </Button>
      </div>
      <ChatMessages 
        chats={messages.map(msg => ({
          ...msg,
          // Add any missing properties needed by the ChatMessages component
          id: msg.id || Math.random().toString(36).substr(2, 9),
          timestamp: msg.timestamp || Date.now()
        }))} 
        user={user!} 
        recipient={recipient}
        onDeleteMessage={handleDeleteMessage}
      />
      <ChatInput 
        message={message}
        setMessage={setMessage}
        isListening={isListening}
        toggleListening={toggleListening}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatInterface;
