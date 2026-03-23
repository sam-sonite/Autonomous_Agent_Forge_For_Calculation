import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendQuery } from '../lib/api';

interface ChatBotProps {
  isExpanded: boolean;
  onToggle: () => void;
  onStartWorkflow: () => void;
  currentStep?: number;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function ChatBot({ isExpanded, onToggle, onStartWorkflow, currentStep = 0 }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "Hi, how can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Add completion message when workflow ends
  useEffect(() => {
    if (currentStep === 10 && messages[messages.length - 1]?.content !== "Task completed and System Ready for New Query") {
      const completionMessage: Message = {
        role: 'system',
        content: "Task completed and System Ready for New Query"
      };
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [currentStep, messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isSending) return;

    // Check if user wants to clear the chat
    if (inputValue.trim().toLowerCase() === 'clear') {
      setMessages([
        {
          role: 'system',
          content: "Hi, how can I help you today?"
        }
      ]);
      setInputValue('');
      return;
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    sendQuery(userMessage.content)
      .then((result) => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.assistantMessage,
        };
        setMessages(prev => [...prev, assistantMessage]);

        if (result.workflowTrigger || checkIfWorkflowTrigger(userMessage.content.trim().toLowerCase())) {
          setTimeout(() => {
            onStartWorkflow();
          }, 500);
        }
      })
      .catch(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: "The backend is not reachable right now, but the UI remains ready for the workflow demo.",
        };
        setMessages(prev => [...prev, assistantMessage]);
      })
      .finally(() => setIsSending(false));
  };

  // Helper function to detect workflow trigger queries
  const checkIfWorkflowTrigger = (query: string): boolean => {
    // Keywords that indicate a scientific calculator/complex math query
    const scientificKeywords = [
      'scientific calculator',
      'complex number',
      'matrix',
      'calculus',
      'derivative',
      'integral',
      'eigenvalue',
      'statistical analysis',
      'regression',
      'hypothesis testing',
      'symbolic equation',
      'mathematical operation',
      'web-based data',
      'mathematical constant',
      '3d function plotting',
      'visualization'
    ];

    // Check if query contains multiple scientific keywords
    const keywordCount = scientificKeywords.filter(keyword => 
      query.includes(keyword)
    ).length;

    // Trigger if query contains 2 or more scientific keywords
    return keywordCount >= 2;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="relative">
      {/* Floating Icon Button - Only visible when collapsed */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={onToggle}
          className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-blue-500 shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Chat Overlay - Visible when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/20 z-40"
            />
            
            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-8 right-8 w-[450px] z-50"
            >
              <Card className="bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="mb-0 text-white">Chat Assistant</h3>
                  </div>
                  <button
                    onClick={onToggle}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50 scrollbar-thin">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === 'system'
                            ? 'bg-white text-slate-700 border border-slate-200'
                            : message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {message.role === 'system' && (
                          <div className="text-slate-500 mb-1">System</div>
                        )}
                        <p className="mb-0">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isSending}
                      className="px-6"
                    >
                      {isSending ? '...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
