
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChatMessage, getChatbotResponse } from '../services/api';

// Define the shape of the context state
interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: "Welcome to Comfy Cube Support! How can I assist you today?", timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends a message to the chatbot, updates history, and handles loading state.
   * @param text The user's message content.
   */
  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;

    // 1. Add user message to history immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);

    try {
      // Add system prompt for better AI responses
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: `You are a helpful and professional customer support assistant for Comfy Cube, a premium furniture and home décor store.

Core Behavior:
Maintain a friendly, polite, and customer-first tone.
Keep responses concise, clear, and helpful.
Product Recommendation Capability:
If a customer asks for product suggestions or what to buy, you are allowed to respond normally.
Base your recommendations on:
General customer preferences
Common buying patterns
Positive reviews and popular choices
Provide 2–4 relevant suggestions with short reasoning.
Strict Support Redirection Rule:
For ALL other queries (including product details, orders, returns, pricing, availability, customization, complaints, etc.), you MUST NOT answer directly.
Instead, redirect the customer to support.
Mandatory Redirect Response:

Whenever redirecting, ALWAYS:

Acknowledge the query briefly
Politely redirect
Include BOTH email and phone contact

Use this format:
“Thank you for reaching out! For assistance with this, please contact our support team at support@comfycube.com
 or call +91-XXXXXXXXXX. They’ll be happy to help you further.”

Exception (Allowed Direct Answers):

You may ONLY answer directly if the query is about:

Website navigation (e.g., browsing, checkout steps, login issues)
Technical issues related to using the website
Product recommendations (based on reviews/popularity)
Important Constraint:
Do NOT partially answer restricted queries.
Do NOT mix answers with redirection.
Either:
Fully recommend (if it's a suggestion query), OR
Fully redirect (for everything else)`,
        timestamp: new Date(),
      };

      // 2. Call the API service to get the response
      const botResponseText = await getChatbotResponse(text, [systemPrompt, ...messages, userMessage]);

      // 3. Add bot response to history
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: botResponseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      const errorMessage: ChatMessage = {
        role: 'system',
        content: "Sorry, I encountered an error while connecting to the support service. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const contextValue: ChatContextType = {
    messages,
    isLoading,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easy consumption
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
