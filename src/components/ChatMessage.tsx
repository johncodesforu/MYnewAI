import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { User, Bot, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`flex w-full mb-8 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${isAssistant ? 'bg-indigo-600 dark:bg-indigo-500 text-white mr-3 shadow-indigo-500/20' : 'bg-neutral-800 dark:bg-neutral-700 text-white ml-3 shadow-neutral-800/20'}`}>
          {isAssistant ? <Bot size={20} /> : <User size={20} />}
        </div>
        
        <div className={`group relative px-5 py-4 rounded-[2rem] message-bubble transition-all duration-300 ${
          isAssistant 
            ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none rounded-tl-none text-neutral-800 dark:text-neutral-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
            : 'bg-indigo-600 dark:bg-indigo-700 text-white rounded-tr-none shadow-[0_5px_15px_rgba(79,70,229,0.2)]'
        }`}>
          {message.attachments && message.attachments.length > 0 && (
            <div className={`mb-4 grid gap-2.5 ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {message.attachments.map((attachment, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-neutral-100/10 dark:border-white/5 shadow-inner">
                  {attachment.mimeType === 'application/pdf' ? (
                    <div className={`flex items-center gap-3 p-3.5 border rounded-2xl h-full transition-all ${
                      isAssistant 
                        ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm' 
                        : 'bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/40'
                    }`}>
                      <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                        isAssistant ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400' : 'bg-rose-500 text-white'
                      }`}>
                        <FileText size={22} />
                      </div>
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className={`text-[13px] font-bold truncate max-w-[140px] ${!isAssistant && 'text-white'}`}>
                          {attachment.fileName || 'Archive.pdf'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider opacity-60 ${!isAssistant && 'text-indigo-100'}`}>PDF Document</span>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={attachment.url} 
                      alt="Attachment" 
                      className="w-full max-h-[350px] object-cover transition-all hover:scale-105 duration-700 cursor-zoom-in"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          
          <div className={`text-[10px] mt-2 font-bold opacity-0 group-hover:opacity-60 transition-opacity absolute bottom-2 ${isAssistant ? '-right-14 text-neutral-500' : '-left-14 text-indigo-100 text-right'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
