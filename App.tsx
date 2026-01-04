
import React, { useState, useRef, useEffect } from 'react';
import { VoiceControls } from './components/VoiceControls';
import { HistoryList } from './components/HistoryList';
import { SpeechConfig, GeneratedSpeech, BACKGROUND_TRACKS } from './types';
import { generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [config, setConfig] = useState<SpeechConfig>({
    voice: 'Nova',
    emotion: 'Neutral',
    emotionIntensity: 0.7,
    speed: 1.0,
    pitch: 'Medium',
    backgroundTrackId: 'none',
    backgroundVolume: 0.3
  });
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedSpeech[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('vocalize_studio_theme');
    return saved ? saved === 'dark' : true; // Default to dark mode
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('vocalize_studio_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vocalize_studio_theme', 'light');
    }
  }, [isDark]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { blob, url } = await generateSpeech(
        text, 
        config.voice, 
        config.emotion, 
        config.emotionIntensity,
        config.speed, 
        config.pitch
      );
      
      const newEntry: GeneratedSpeech = {
        id: Math.random().toString(36).substr(2, 9),
        text: text,
        voice: config.voice,
        emotion: config.emotion,
        emotionIntensity: config.emotionIntensity,
        speed: config.speed,
        pitch: config.pitch,
        timestamp: Date.now(),
        audioBlob: blob,
        audioUrl: url,
        backgroundTrackId: config.backgroundTrackId !== 'none' ? config.backgroundTrackId : undefined,
        backgroundVolume: config.backgroundVolume
      };

      setHistory(prev => [newEntry, ...prev]);
      playSpeech(newEntry);
      
    } catch (err: any) {
      setError(err.message || 'The studio is busy. Please try a shorter script.');
    } finally {
      setIsLoading(false);
    }
  };

  const playSpeech = (speech: GeneratedSpeech) => {
    if (!audioRef.current || !bgAudioRef.current) return;

    // 1. Reset and Load Speech
    audioRef.current.pause();
    audioRef.current.src = speech.audioUrl;
    audioRef.current.load();
    
    // 2. Handle Background Music
    const trackId = speech.backgroundTrackId || 'none';
    const track = BACKGROUND_TRACKS.find(t => t.id === trackId);
    
    if (track && track.url) {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = track.url;
      bgAudioRef.current.volume = speech.backgroundVolume || 0.3;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.load();
      
      bgAudioRef.current.play().catch(e => console.warn("Background audio play deferred", e));

      // Clean cleanup of previous listeners
      const stopBg = () => {
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
          bgAudioRef.current.currentTime = 0;
          bgAudioRef.current.src = ""; // Clear source to prevent "no source" error next time
        }
      };
      
      // Use { once: true } for cleaner management
      audioRef.current.addEventListener('ended', stopBg, { once: true });
    } else {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = ""; // Ensure we clear the source
    }

    // 3. Play Speech
    audioRef.current.play().catch(err => {
      console.error("Playback failed:", err);
      setError("Playback was blocked by the browser. Please click Play manually.");
    });
  };

  const deleteHistory = (id: string) => {
    setHistory(prev => {
      const item = prev.find(h => h.id === id);
      if (item) URL.revokeObjectURL(item.audioUrl);
      return prev.filter(h => h.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-50 transition-colors duration-300 selection:bg-blue-500/30 font-sans">
      <audio ref={audioRef} preload="auto" hidden />
      <audio ref={bgAudioRef} preload="auto" hidden />

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] rounded-full"></div>
      </div>

      <nav className="border-b border-slate-200 dark:border-slate-800/60 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
              <i className="fas fa-waveform text-white text-xl animate-pulse"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">VOCALIZE<span className="text-blue-500">PRO</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">Studio v2.5</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Engine Live</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
             <div className="hidden lg:block text-right">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">Current Artist</p>
                <p className="text-sm font-bold text-slate-700 dark:text-white">{config.voice} - {config.emotion}</p>
             </div>
             <div className="hidden lg:block h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
             <div className="flex gap-4">
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:border-blue-200 dark:hover:border-slate-600 transition-all shadow-sm"
                >
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                <button className="hidden sm:flex w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-white hover:border-blue-200 dark:hover:border-slate-600 transition-all shadow-sm">
                  <i className="fas fa-cog"></i>
                </button>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[32px] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass rounded-[30px] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                    <h2 className="text-xs font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.3em]">Recording Booth</h2>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-slate-500 dark:text-slate-400 font-bold">
                        {text.length} / 5000 Characters
                     </span>
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your script here... (e.g., Once upon a time in a land far away...)"
                  className="w-full h-[400px] bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-700 text-2xl font-medium leading-relaxed resize-none focus:ring-0 scrollbar-hide"
                  style={{ textShadow: '0 0 40px rgba(0,0,0,0.02)' }}
                />
                
                <div className="mt-8 flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !text.trim()}
                    className={`flex-1 relative overflow-hidden h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-xl ${
                      isLoading || !text.trim()
                        ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-blue-50 scale-100 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-6 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1.5 h-6 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-6 bg-blue-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        Synthesizing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play-circle text-lg"></i>
                        Master & Render
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setText('')}
                    className="px-8 h-16 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                  >
                    Reset
                  </button>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 rounded-2xl text-red-500 dark:text-red-400 text-[11px] font-bold flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                       <i className="fas fa-circle-exclamation"></i>
                    </div>
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Neural Fidelity', val: '24-bit PCM', icon: 'fa-microchip', col: 'text-blue-500' },
                { label: 'Sync Rate', val: 'Low Latency', icon: 'fa-bolt', col: 'text-amber-500' },
                { label: 'Studio Format', val: 'Broadcast WAV', icon: 'fa-file-audio', col: 'text-emerald-500' }
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-[24px] border-none flex items-center gap-4 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${stat.col} shadow-inner`}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <section className="glass rounded-[32px] p-8 relative overflow-hidden group shadow-xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-30 dark:opacity-50"></div>
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                Studio Configuration
              </h2>
              <VoiceControls
                config={config}
                onChange={setConfig}
                disabled={isLoading}
              />
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <i className="fas fa-layer-group text-indigo-500"></i>
                  Recent Renders
                </h2>
                {history.length > 0 && (
                  <button 
                    onClick={() => setHistory([])}
                    className="text-[10px] font-black text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Clear Desk
                  </button>
                )}
              </div>
              <HistoryList
                history={history}
                onPlay={playSpeech}
                onDelete={deleteHistory}
              />
            </section>
          </div>

        </div>
      </main>

      <footer className="mt-32 py-16 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <div className="flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center">
                 <i className="fas fa-brain text-slate-400 dark:text-slate-500"></i>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Gemini 2.5 Multi-Modal Synthesis</p>
           </div>
           <div className="flex gap-10 text-slate-900 dark:text-white">
              <span className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-100">Privacy Policy</span>
              <span className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-100">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
