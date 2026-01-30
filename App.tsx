
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { getChatSession } from './services/aivenoService';
import type { Message } from './types';
import { Role } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.ASSISTANT,
      text: 'Namaste. I am Aiveno, your professional assistant. How may I help you today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatSession = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSession.current = getChatSession();
  }, []);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: Role.USER, text: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      if (!chatSession.current) {
        throw new Error("Chat session not initialized.");
      }
      
      const stream = await chatSession.current.sendMessageStream({ message: userInput });
      
      let assistantResponse = '';
      setMessages(prev => [...prev, { role: Role.ASSISTANT, text: '...' }]);

      for await (const chunk of stream) {
        assistantResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = assistantResponse;
            return newMessages;
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: Role.ASSISTANT,
        text: 'I am sorry, but I am facing a technical issue. Please try again in a few moments.',
      };
      setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          if (newMessages[newMessages.length - 1].role === Role.ASSISTANT) {
              newMessages[newMessages.length - 1] = errorMessage;
          } else {
              newMessages.push(errorMessage);
          }
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-md p-4 flex items-center space-x-4 sticky top-0 z-10">
        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Aiveno</h1>
          <p className="text-sm text-slate-500">Your Professional Digital Assistant</p>
        </div>
      </header>

      <main 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length-1].role === Role.USER && (
          <ChatMessage message={{ role: Role.ASSISTANT, text: '...' }} />
        )}
      </main>
      
      <footer className="bg-white p-4 sticky bottom-0 z-10 border-t border-slate-200">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
