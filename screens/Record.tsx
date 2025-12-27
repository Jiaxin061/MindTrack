import React, { useState, useEffect } from 'react';
import { Mic, Camera, FileText, Play, Square, CheckCircle, RefreshCcw, ScanLine, Moon, Smile, Frown, Meh } from 'lucide-react';

const Record: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'facial' | 'manual'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing' | 'done'>('idle');
  const [timer, setTimer] = useState(0);
  
  // Manual Input State
  const [sleepHours, setSleepHours] = useState(7.5);
  const [mood, setMood] = useState<'negative' | 'neutral' | 'positive'>('neutral');

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStart = () => {
    if (activeTab === 'manual') {
      setStatus('analyzing');
      setTimeout(() => setStatus('done'), 1500);
      return;
    }
    setIsRecording(true);
    setStatus('recording');
    setTimeout(() => {
      handleStop();
    }, 5000);
  };

  const handleStop = () => {
    setIsRecording(false);
    setStatus('analyzing');
    setTimeout(() => setStatus('done'), 2000);
  };

  const reset = () => {
    setStatus('idle');
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      {/* Header section */}
      <div className="px-6 pt-6 bg-white pb-4 shadow-sm shrink-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">New Session</h1>
        <p className="text-sm text-slate-500">Multimodal health check</p>
        
        {/* Sub Tabs */}
        <div className="flex space-x-1 mt-6 bg-slate-100 p-1 rounded-2xl">
          {(['voice', 'facial', 'manual'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                reset();
              }}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'voice' && <Mic size={16} className="mr-2" />}
              {tab === 'facial' && <Camera size={16} className="mr-2" />}
              {tab === 'manual' && <FileText size={16} className="mr-2" />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main interaction area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20 w-full relative overflow-hidden">
        
        {/* --- IDLE STATE: SELECTION VIEW --- */}
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Dynamic Visual Container */}
            <div className="mb-6 relative w-full flex justify-center">
              {/* Voice Visual */}
              {activeTab === 'voice' && (
                <div className="w-56 h-56 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                  <Mic size={64} className="text-teal-400 opacity-80" />
                </div>
              )}

              {/* Facial Visual - Camera Preview Box (REDUCED HEIGHT TO h-64) */}
              {activeTab === 'facial' && (
                <div className="w-64 h-64 bg-slate-900 rounded-[32px] border-8 border-slate-200 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                  {/* Fake camera UI overlay */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <ScanLine size={48} className="text-white/50 mb-2" />
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Camera Ready</p>
                  
                  {/* Face Guide Overlay */}
                  <div className="absolute inset-0 border-2 border-white/20 rounded-[24px] m-6 border-dashed"></div>
                </div>
              )}

              {/* Manual Visual - Input Form (COMPACTED) */}
              {activeTab === 'manual' && (
                <div className="w-full bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 text-left space-y-5">
                  {/* Sleep Input */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="flex items-center text-slate-700 font-bold text-base">
                        <Moon size={18} className="mr-2 text-indigo-500" /> Sleep Duration
                      </label>
                      <span className="text-indigo-600 font-mono font-bold text-lg w-16 text-right">
                        {sleepHours} hrs
                      </span>
                    </div>
                    
                    <div className="relative h-6 flex items-center">
                      <input 
                        type="range" 
                        min="0" max="12" step="0.5"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600 transition-all"
                      />
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono uppercase font-bold tracking-wide px-1">
                      <span>0h</span>
                      <span className="text-indigo-300">Target: 8h</span>
                      <span>12h</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Mood Input (COMPACTED) */}
                  <div>
                    <label className="block text-slate-700 font-bold text-base mb-3">Current Mood</label>
                    <div className="flex justify-between space-x-2">
                      {[
                        { val: 'negative', icon: Frown, label: 'Stressed', color: 'bg-rose-50 text-rose-500 border-rose-200 ring-rose-100' },
                        { val: 'neutral', icon: Meh, label: 'Okay', color: 'bg-slate-50 text-slate-500 border-slate-200 ring-slate-100' },
                        { val: 'positive', icon: Smile, label: 'Good', color: 'bg-emerald-50 text-emerald-500 border-emerald-200 ring-emerald-100' }
                      ].map((m) => (
                        <button
                          key={m.val}
                          onClick={() => setMood(m.val as any)}
                          className={`flex-1 py-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                            mood === m.val 
                              ? `${m.color} ring-2 ring-offset-0 border-transparent shadow-sm transform scale-[1.02]` 
                              : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <m.icon size={28} className={`mb-1 transition-transform duration-300 ${mood === m.val ? 'scale-110' : ''}`} strokeWidth={2} />
                          <span className="text-xs font-bold tracking-tight">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Prompt Text */}
            <div className="space-y-1 max-w-xs mx-auto mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {activeTab === 'manual' ? 'Log Data' : 'Ready to begin?'}
              </h3>
              <p className="text-slate-500 text-xs px-2 leading-relaxed">
                {activeTab === 'voice' && "Read the prompt on screen naturally for 10 seconds to analyze vocal stress."}
                {activeTab === 'facial' && "Ensure good lighting. Position your face in the center of the frame."}
                {activeTab === 'manual' && "Manually input your sleep and mood for the KR logic engine."}
              </p>
            </div>

            {/* Main Action Button (Slightly Reduced Height) */}
            <button 
              onClick={handleStart}
              className="bg-teal-500 text-white w-full py-4 rounded-full font-bold shadow-lg shadow-teal-100 flex items-center justify-center space-x-2 active:scale-[0.98] transition-all hover:bg-teal-600 hover:shadow-xl text-lg tracking-wide"
            >
              {activeTab === 'manual' ? (
                <>
                  <CheckCircle size={22} fill="currentColor" className="text-teal-600" />
                  <span className="text-white">Submit Entry</span>
                </>
              ) : (
                <>
                  <Play size={22} fill="currentColor" />
                  <span>Start Analysis</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* --- RECORDING STATE --- */}
        {status === 'recording' && (
          <div className="flex flex-col items-center justify-center space-y-12 w-full max-w-xs animate-in zoom-in duration-300">
            {/* ... (Recording UI remains mostly the same, just checking container fit) ... */}
            {activeTab === 'voice' && (
               <>
               <div className="relative h-24 flex items-end justify-center space-x-1.5 px-4 overflow-hidden w-full">
                 {[...Array(15)].map((_, i) => (
                   <div 
                     key={i} 
                     className="w-2 bg-teal-500 rounded-full animate-[bounce_1s_infinite]"
                     style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.05}s` }}
                   ></div>
                 ))}
               </div>
               <div className="text-center">
                 <div className="text-6xl font-mono font-bold text-slate-800 tabular-nums mb-4">{formatTime(timer)}</div>
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                   "The quick brown fox jumps over the lazy dog. Today I am feeling quite balanced and focused."
                 </div>
               </div>
             </>
            )}

            {activeTab === 'facial' && (
              <div className="relative w-64 h-64 bg-slate-900 rounded-[32px] border-4 border-teal-500 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-slate-800 rounded-t-full opacity-50"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-slate-800 rounded-t-lg opacity-50 mb-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-teal-500/30 rounded-[40px]">
                  <div className="absolute top-8 left-6 w-4 h-1 bg-teal-400/50"></div>
                  <div className="absolute top-8 right-6 w-4 h-1 bg-teal-400/50"></div>
                </div>
                <div className="absolute bottom-6 left-0 w-full text-center">
                  <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">Scanning...</span>
                </div>
              </div>
            )}

            <button 
              onClick={handleStop}
              className="bg-rose-500 text-white p-6 rounded-full shadow-lg shadow-rose-100 active:scale-90 transition-transform hover:bg-rose-600"
            >
              <Square size={24} fill="currentColor" />
            </button>
          </div>
        )}

        {/* --- ANALYZING STATE --- */}
        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Processing...</h3>
              <p className="text-slate-500 mt-2 text-xs">
                {activeTab === 'manual' ? 'Running Logic Rules (KR1-KR5)...' : 'Extracting biometric features...'}
              </p>
            </div>
          </div>
        )}

        {/* --- DONE STATE (RESULTS) --- */}
        {status === 'done' && (
          <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 w-full animate-in zoom-in duration-300 max-w-md">
            <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analysis Complete</h3>
            
            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium text-xs">
                  {activeTab === 'voice' ? 'Tone Stability' : activeTab === 'facial' ? 'Emotional Valence' : 'Sleep Quality'}
                </span>
                <span className={`font-bold text-sm ${activeTab === 'manual' && sleepHours < 5 ? 'text-rose-500' : 'text-teal-600'}`}>
                  {activeTab === 'manual' ? (sleepHours < 5 ? 'Critical (Low)' : 'Optimal') : 'Normal Range'}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium text-xs">Burnout Risk</span>
                <span className="text-amber-600 font-bold text-sm">Low (12%)</span>
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-400">Data synced with MindTrack Core.</p>
            
            <button 
              onClick={reset}
              className="mt-6 flex items-center justify-center space-x-2 w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold active:bg-slate-50 transition-colors hover:bg-slate-50 hover:border-slate-200 text-sm"
            >
              <RefreshCcw size={16} />
              <span>Record New</span>
            </button>
          </div>
        )}
      </div>

      {/* CSS Animation for Scanner */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Record;