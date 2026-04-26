import { X, Moon, Sun, Monitor, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function SettingsModal({ isOpen, onClose, theme, onThemeChange }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Appearance Section */}
          <section>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                  <Sun size={24} />
                </div>
                <span className="text-sm font-medium dark:text-neutral-200">Light Mode</span>
              </button>

              <button
                onClick={() => onThemeChange('dark')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                  <Moon size={24} />
                </div>
                <span className="text-sm font-medium dark:text-neutral-200">Dark Mode</span>
              </button>
            </div>
          </section>

          {/* AI Intelligence Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                Model Intelligence
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded-full uppercase">
                <ShieldCheck size={10} />
                Enhanced
              </div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                  <Monitor size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold dark:text-neutral-100">Gemini 3.1 Pro</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Powered with Google Search Grounding</p>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2">
                Your AI is now using the most powerful reasoning engine available, capable of web research and complex analysis of up to 100 files (200MB each).
              </p>
            </div>
          </section>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/20 border-t border-neutral-100 dark:border-neutral-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:scale-[1.02] transition-transform active:scale-95"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
