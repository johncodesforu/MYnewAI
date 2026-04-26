import { useState, useRef, useEffect } from 'react';
import { AssistantMode, Message } from './types';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  PenTool, 
  MessageSquare,
  Plus,
  Settings,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bot,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [mode, setMode] = useState<AssistantMode>(() => {
    const saved = localStorage.getItem('almighty-ai-mode');
    return (saved as AssistantMode) || AssistantMode.GENERAL;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('almighty-ai-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exportToPDF = () => {
    window.print();
  };

  useEffect(() => {
    localStorage.setItem('almighty-ai-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('almighty-ai-messages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, attachment?: { data: string, mimeType: string, url: string, fileName?: string }) => {
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
      attachment: attachment
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(
        mode, 
        messages, 
        content, 
        attachment ? { data: attachment.data, mimeType: attachment.mimeType } : undefined
      );
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      localStorage.removeItem('almighty-ai-messages');
    }
  };

  const modes = [
    { id: AssistantMode.GENERAL, icon: <Sparkles size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: AssistantMode.HOMEWORK, icon: <BookOpen size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: AssistantMode.BUSINESS, icon: <Briefcase size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: AssistantMode.CREATIVE, icon: <PenTool size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            id="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white border-r border-neutral-200 flex flex-col z-20"
          >
            <div className="p-4 border-bottom border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg text-indigo-600">
                <BrainCircuit size={24} />
                <span>Almighty AI</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <button 
                onClick={clearChat}
                className="w-full flex items-center gap-2 p-3 mb-6 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all font-medium"
              >
                <Plus size={18} />
                <span>New Conversation</span>
              </button>

              <div className="mb-8">
                <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Assistant Modes
                </h3>
                <div className="space-y-1">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        mode === m.id 
                          ? `${m.bg} ${m.color} font-semibold shadow-sm` 
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {m.icon}
                      <span className="text-sm">{m.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-neutral-600 hover:bg-neutral-50 transition-all text-sm font-medium">
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 no-print"
              >
                <ChevronRight size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-neutral-800">{mode}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 no-print">
            {messages.length > 0 && (
              <button 
                onClick={exportToPDF}
                title="Export as PDF"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-all group"
              >
                <Download size={14} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
            <button 
              onClick={clearChat}
              title="Clear history"
              className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-neutral-400 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-neutral-200 chat-container">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4 no-print">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                  <BrainCircuit size={32} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
                  How can I help you today?
                </h1>
                <p className="text-neutral-500 max-w-md text-sm md:text-base">
                  I'm your intelligent assistant powered by Gemini. Upload a <b>PDF</b> or <b>Image</b> to start an analysis.
                </p>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                  {[
                    "Analyze the attached PDF document",
                    "Summarize this research paper",
                    "What can you see in this image?",
                    "Check this chart for trends"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-4 bg-white border border-neutral-200 rounded-xl text-left text-sm text-neutral-600 hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <span>{suggestion}</span>
                      <ChevronRight size={14} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <ChatMessage key={idx} message={message} />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start mb-6 no-print"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 mr-3 flex items-center justify-center">
                      <Bot size={18} className="animate-spin-slow" />
                    </div>
                    <div className="px-4 py-3 bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent no-print">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            <p className="text-[10px] text-center mt-3 text-neutral-400 font-medium">
              Supports <b>PDF</b> and <b>Images</b> up to 20MB. Clear history anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
