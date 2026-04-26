import { useState, useRef, useEffect } from 'react';
import { AssistantMode, Message } from './types';
import { geminiService } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('almighty-ai-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  useEffect(() => {
    localStorage.setItem('almighty-ai-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: { data: string, mimeType: string, url: string, fileName?: string }[]) => {
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: attachments
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(
        mode, 
        messages, 
        content, 
        attachments ? attachments.map(a => ({ data: a.data, mimeType: a.mimeType })) : undefined
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
    { id: AssistantMode.GENERAL, icon: <Sparkles size={18} />, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: AssistantMode.HOMEWORK, icon: <BookOpen size={18} />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: AssistantMode.BUSINESS, icon: <Briefcase size={18} />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: AssistantMode.CREATIVE, icon: <PenTool size={18} />, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            id="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-20 transition-colors"
          >
            <div className="p-4 border-bottom border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
                <BrainCircuit size={24} />
                <span>Almighty AI</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 md:hidden"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <button 
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2.5 p-3.5 mb-8 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-indigo-600/50 dark:hover:border-indigo-400/50 hover:bg-white dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-200 transition-all font-bold text-sm shadow-sm hover:shadow-md active:scale-95 group"
              >
                <Plus size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-90 transition-transform duration-300" />
                <span>New Conversation</span>
              </button>

              <div className="mb-8">
                <h3 className="px-3 mb-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                  Intelligence Mode
                </h3>
                <div className="space-y-1.5">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 ${
                        mode === m.id 
                          ? `${m.bg} ${m.color} font-bold shadow-sm ring-1 ring-neutral-200/50 dark:ring-neutral-700/50` 
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:translate-x-1'
                      }`}
                    >
                      <span className={mode === m.id ? 'scale-110 transition-transform' : ''}>{m.icon}</span>
                      <span className="text-[13px]">{m.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-sm font-medium"
              >
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
        <header className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 no-print"
              >
                <ChevronRight size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{mode}</h2>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-all group"
              >
                <Download size={14} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
            <button 
              onClick={clearChat}
              title="Clear history"
              className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 text-neutral-400 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 chat-container">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4 no-print max-w-2xl mx-auto">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-indigo-600 dark:bg-indigo-500 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20"
                >
                  <BrainCircuit size={40} />
                </motion.div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight"
                >
                  Almighty Intelligence
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-neutral-500 dark:text-neutral-400 max-w-md text-base md:text-lg mb-12 leading-relaxed"
                >
                  Experience the next generation of reasoning. Analyze up to <b>100 files</b> with <b>Google Search grounding</b>.
                </motion.p>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                >
                  {[
                    "Analyze these 10 PDFs for trends",
                    "Compare 5 images of market data",
                    "Research the latest in LLM architectures",
                    "Write a creative brief based on my files"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-between group"
                    >
                      <span>{suggestion}</span>
                      <ChevronRight size={18} className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </motion.div>
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3 flex items-center justify-center">
                      <Bot size={18} className="animate-spin-slow" />
                    </div>
                    <div className="px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full animate-bounce" />
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
        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 via-neutral-50 dark:via-neutral-950 to-transparent no-print">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            <p className="text-[10px] text-center mt-3 text-neutral-400 dark:text-neutral-500 font-medium">
              Supports <b>PDF</b> and <b>Images</b> up to 200MB. Clear history anytime.
            </p>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
