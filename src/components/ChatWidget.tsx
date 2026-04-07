
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, X, Send } from 'lucide-react';

// Component to render a single message bubble
const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar for the sender */}
        <Avatar className="shrink-0 w-8 h-8">
          {isUser ? (
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          ) : (
            <AvatarFallback className="bg-green-500 text-white">AI</AvatarFallback>
          )}
        </Avatar>
        
        {/* Message Content */}
        <div className={`px-4 py-2 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted text-foreground rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs mt-1 opacity-70 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * The main Chatbot Widget component.
 * It handles the UI, input, and calls the context's sendMessage function.
 */
const ChatWidget: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom whenever messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await sendMessage(input.trim());
      setInput('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-full max-w-lg h-[600px] shadow-2xl border-0 bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">🤖</span>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Comfy Cube Support</CardTitle>
                  <p className="text-sm text-muted-foreground">Available 24/7 for your questions</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleChat} className="hover:bg-destructive/10 hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Message Display Area */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[450px] p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Start a conversation!</p>
                  <p className="text-xs">Ask me about products, orders, or support.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessageBubble key={index} message={message} />
                ))
              )}
              {/* Placeholder for scrolling target */}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          {/* Input Form */}
          <div className="p-4 border-t bg-background/50">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    handleSend(e);
                  }
                }}
                disabled={isLoading}
                className="flex-1 border-0 bg-muted/50 focus:bg-background transition-colors"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 animate-in zoom-in-50"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
