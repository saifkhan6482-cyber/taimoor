
import React from 'react';
import { GeneratedSpeech, CHARACTERS } from '../types';

interface HistoryListProps {
  history: GeneratedSpeech[];
  onPlay: (speech: GeneratedSpeech) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onPlay, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-700 border-2 border-dashed border-slate-200 dark:border-slate-900 rounded-[32px] bg-white/50 dark:bg-slate-950/50">
        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
           <i className="fas fa-microphone-slash text-2xl opacity-20"></i>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Vault is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => {
        const char = CHARACTERS.find(c => c.id === item.voice);
        return (
          <div 
            key={item.id} 
            className="group glass p-5 rounded-[24px] border-none flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 hover:ring-1 hover:ring-slate-200 dark:hover:ring-white/10 transition-all shadow-md dark:shadow-lg"
          >
            <div className="flex-1 min-w-0 pr-6 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${char ? char.color.split(' ')[0].replace('from-', 'text-') : 'text-blue-500'} flex-shrink-0 shadow-inner`}>
                <i className={`fas ${char?.icon || 'fa-user'}`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-slate-800 dark:text-slate-100 text-sm font-bold truncate">"{item.text}"</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    {item.voice}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    {item.speed}x
                  </span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    {item.emotion}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlay(item)}
                className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-50 transition-all flex items-center justify-center shadow-md"
              >
                <i className="fas fa-play text-xs"></i>
              </button>
              <a
                href={item.audioUrl}
                download={`Render_${item.voice}_${item.id}.wav`}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-slate-600 hover:text-blue-500 dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
              >
                <i className="fas fa-download text-xs"></i>
              </a>
              <button
                onClick={() => onDelete(item.id)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 hover:text-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
