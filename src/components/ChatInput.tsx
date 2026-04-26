import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, FileText } from 'lucide-react';

interface Attachment {
  data: string;
  mimeType: string;
  url: string;
  fileName?: string;
}

interface ChatInputProps {
  onSend: (message: string, attachment?: Attachment) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachment) && !disabled) {
      onSend(input, attachment || undefined);
      setInput('');
      setAttachment(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      alert('Please upload an image or a PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachment({
        data: base64.split(',')[1],
        mimeType: file.type,
        url: base64,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    <div className="flex flex-col gap-2">
      {attachment && (
        <div className="relative inline-flex items-center gap-3 p-2 bg-white border border-neutral-200 rounded-xl shadow-sm self-start animate-in fade-in slide-in-from-bottom-2">
          {attachment.mimeType === 'application/pdf' ? (
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded flex items-center justify-center">
              <FileText size={20} />
            </div>
          ) : (
            <img 
              src={attachment.url} 
              alt="Preview" 
              className="h-10 w-auto rounded object-contain"
            />
          )}
          <span className="text-[11px] font-medium text-neutral-600 max-w-[150px] truncate">
            {attachment.fileName}
          </span>
          <button
            onClick={() => setAttachment(null)}
            className="p-1 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white p-3 border border-neutral-200 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 p-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-all duration-200"
          title="Attach image or PDF"
        >
          <ImageIcon size={20} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything or analyze a file..."
          className="flex-1 max-h-[200px] py-1 bg-transparent border-none focus:ring-0 resize-none text-neutral-800 placeholder-neutral-400 text-sm md:text-base scrollbar-hide"
          disabled={disabled}
        />
        
        <button
          type="submit"
          disabled={(!input.trim() && !attachment) || disabled}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
            (input.trim() || attachment) && !disabled
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
