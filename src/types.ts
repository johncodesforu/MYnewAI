export enum AssistantMode {
  GENERAL = 'General Assistant',
  HOMEWORK = 'Homework Helper',
  BUSINESS = 'Business Assistant',
  CREATIVE = 'Creative Writer'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: {
    data: string; // base64
    mimeType: string;
    url: string; // for UI display
    fileName?: string;
  }[];
}

export interface ChatSession {
  id: string;
  mode: AssistantMode;
  messages: Message[];
}
