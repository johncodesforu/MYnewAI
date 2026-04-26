import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface Attachment {
  data: string;
  mimeType: string;
  url: string;
  fileName?: string;
}

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSend(input, attachments.length > 0 ? attachments : undefined);
      setInput('');
      setAttachments([]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (attachments.length + files.length > 100) {
      alert('You can only upload up to 100 files at a time.');
      return;
    }

    const newAttachments: Attachment[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
        alert(`File ${file.name} is not an image or PDF and will be skipped.`);
        continue;
      }

      if (file.size > 200 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 200MB limit and will be skipped.`);
        continue;
      }

      const attachment = await new Promise<Attachment>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          resolve({
            data: base64.split(',')[1],
            mimeType: file.type,
            url: base64,
            fileName: file.name
          });
        };
        reader.readAsDataURL(file);
      });

      newAttachments.push(attachment);
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col gap-3">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto p-3 bg-neutral-100/30 dark:bg-neutral-800/20 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-sm">
          {attachments.map((attachment, idx) => (
            <motion.div 
              key={idx} 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative group inline-flex items-center gap-2.5 p-1.5 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              {attachment.mimeType === 'application/pdf' ? (
                <div className="h-9 w-9 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center shadow-inner">
                  <FileText size={18} />
                </div>
              ) : (
                <img 
                  src={attachment.url} 
                  alt="preview" 
                  className="h-9 w-9 rounded-lg object-cover shadow-inner"
                />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 max-w-[100px] truncate">
                  {attachment.fileName}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-black">Ready</span>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-neutral-900 dark:bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg scale-75 group-hover:scale-100"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative flex items-end gap-3 bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          multiple
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
          title="Attach up to 100 images or PDFs (max 200MB each)"
        >
          <ImageIcon size={20} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything or analyze files..."
          className="flex-1 max-h-[200px] py-1 bg-transparent border-none focus:ring-0 resize-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm md:text-base scrollbar-hide"
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={(!input.trim() && attachments.length === 0) || disabled}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
            (input.trim() || attachments.length > 0) && !disabled
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
