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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isAssistant ? 'bg-indigo-100 text-indigo-600 mr-3' : 'bg-neutral-800 text-white ml-3'}`}>
          {isAssistant ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div className={`px-4 py-3 rounded-2xl message-bubble ${
          isAssistant 
            ? 'bg-white border border-neutral-200 shadow-sm rounded-tl-none' 
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}>
          {message.attachment && (
            <div className="mb-2">
              {message.attachment.mimeType === 'application/pdf' ? (
                <div className={`flex items-center gap-3 p-3 border rounded-xl ${isAssistant ? 'bg-neutral-50 border-neutral-100' : 'bg-indigo-500/20 border-indigo-500/30'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isAssistant ? 'bg-rose-100 text-rose-600' : 'bg-rose-500 text-white'}`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-semibold truncate ${!isAssistant && 'text-indigo-50'}`}>
                      {message.attachment.fileName || 'PDF Document'}
                    </span>
                    <span className={`text-[10px] ${isAssistant ? 'text-neutral-400' : 'text-indigo-200'}`}>
                      Portable Document Format
                    </span>
                  </div>
                </div>
              ) : (
                <img 
                  src={message.attachment.url} 
                  alt="Attachment" 
                  className="max-w-full max-h-[300px] rounded-lg border border-neutral-100 shadow-sm"
                />
              )}
            </div>
          )}
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          <div className={`text-[10px] mt-1 opacity-60 ${isAssistant ? 'text-neutral-500' : 'text-indigo-100'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
