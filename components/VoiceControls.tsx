
import React, { useState } from 'react';
import { Emotion, SpeechConfig, CHARACTERS, BACKGROUND_TRACKS } from '../types';

interface VoiceControlsProps {
  config: SpeechConfig;
  onChange: (config: SpeechConfig) => void;
  disabled: boolean;
}

const EMOTIONS: Emotion[] = [
  'Neutral', 'Professional', 'Authoritative', 'Serious', 'Dramatic', 
  'Mysterious', 'Cheerful', 'Excited', 'Sympathetic', 'Calm', 'Whispered', 'Sarcastic'
];

const PITCHES: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

type GenderFilter = 'All' | 'Male' | 'Female' | 'Other';

export const VoiceControls: React.FC<VoiceControlsProps> = ({ config, onChange, disabled }) => {
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('All');

  const filteredCharacters = CHARACTERS.filter(char => {
    if (genderFilter === 'All') return true;
    if (genderFilter === 'Other') return char.gender === 'Non-binary';
    return char.gender === genderFilter;
  });

  return (
    <div className="space-y-8">
      {/* Voice Talent Pool */}
      <div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Voice Talent Pool</label>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">MASTER QUALITY</span>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800/60 w-full">
            {(['All', 'Male', 'Female', 'Other'] as GenderFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setGenderFilter(f)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${
                  genderFilter === f
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {f === 'Male' && <i className="fas fa-mars text-[8px]"></i>}
                {f === 'Female' && <i className="fas fa-venus text-[8px]"></i>}
                {f === 'Other' && <i className="fas fa-transgender text-[8px]"></i>}
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-300">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((char) => (
              <button
                key={char.id}
                disabled={disabled}
                onClick={() => onChange({ ...config, voice: char.id })}
                className={`relative overflow-hidden group p-3 rounded-2xl border transition-all text-left flex flex-col gap-2 animate-in fade-in zoom-in duration-300 ${
                  config.voice === char.id
                    ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-white/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/50'
                }`}
              >
                {config.voice === char.id && (
                  <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${char.color} opacity-10 dark:opacity-20 blur-2xl`}></div>
                )}
                
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                    config.voice === char.id 
                      ? `bg-gradient-to-br ${char.color} text-white scale-105` 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    <i className={`fas ${char.icon} text-xs`}></i>
                  </div>
                  <div className="min-w-0">
                    <div className={`font-black text-[11px] truncate ${config.voice === char.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {char.name}
                    </div>
                    <div className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${config.voice === char.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}>
                      {char.gender === 'Male' && <i className="fas fa-mars opacity-50"></i>}
                      {char.gender === 'Female' && <i className="fas fa-venus opacity-50"></i>}
                      {char.role}
                    </div>
                  </div>
                </div>
                
                <p className={`text-[9px] leading-relaxed line-clamp-2 transition-colors duration-300 ${
                  config.voice === char.id ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {char.desc}
                </p>
              </button>
            ))
          ) : (
            <div className="col-span-2 py-10 text-center opacity-30">
               <i className="fas fa-search-minus text-2xl mb-2"></i>
               <p className="text-[10px] font-black uppercase tracking-widest">No talents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Texture */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-6">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Performance Texture</label>
          <div className="grid grid-cols-3 gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                disabled={disabled}
                onClick={() => onChange({ ...config, emotion: e })}
                className={`px-2 py-1.5 rounded-xl text-[9px] font-black transition-all border uppercase tracking-wider text-center ${
                  config.emotion === e
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300 shadow-sm'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {config.emotion !== 'Neutral' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Acting Intensity</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{(config.emotionIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.emotionIntensity}
              disabled={disabled}
              onChange={(e) => onChange({ ...config, emotionIntensity: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}
      </div>

      {/* Studio Score / Background Audio */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Studio Score</label>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-black bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">BACKGROUND TRACK</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {BACKGROUND_TRACKS.map((track) => (
            <button
              key={track.id}
              disabled={disabled}
              onClick={() => onChange({ ...config, backgroundTrackId: track.id })}
              className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all border uppercase tracking-wider flex items-center gap-2 ${
                config.backgroundTrackId === track.id
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <i className={`fas ${track.icon}`}></i>
              {track.name}
            </button>
          ))}
        </div>

        {config.backgroundTrackId !== 'none' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Mixing Level</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">{(config.backgroundVolume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.backgroundVolume}
              disabled={disabled}
              onChange={(e) => onChange({ ...config, backgroundVolume: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/60">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Pitch Contour</label>
            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-inner">
              {PITCHES.map((p) => (
                <button
                  key={p}
                  disabled={disabled}
                  onClick={() => onChange({ ...config, pitch: p })}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${
                    config.pitch === p
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span>Rhythm</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{config.speed.toFixed(1)}x</span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={config.speed}
                disabled={disabled}
                onChange={(e) => onChange({ ...config, speed: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
