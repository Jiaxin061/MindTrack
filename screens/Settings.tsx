
import React, { useState } from 'react';
import { Camera, Mic, Bell, Shield, Moon, Info, ChevronRight, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const [privacy, setPrivacy] = useState({ camera: true, mic: true, notifications: false });

  const toggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    { icon: Shield, label: 'Data & Privacy', value: '' },
    { icon: Moon, label: 'Sleep Baseline', value: '7.5 hours' },
    { icon: Info, label: 'About MindTrack', value: 'v1.4.2' },
  ];

  return (
    <div className="flex flex-col space-y-6 pb-24 overflow-y-auto max-h-screen custom-scrollbar">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">Configure your experience</p>
      </header>

      <section className="px-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Permissions</h2>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><Camera size={20} /></div>
              <span className="text-sm font-bold text-slate-700">Camera Access</span>
            </div>
            <button 
              onClick={() => toggle('camera')}
              className={`w-12 h-6 rounded-full transition-colors relative ${privacy.camera ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${privacy.camera ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-teal-50 text-teal-500 rounded-xl"><Mic size={20} /></div>
              <span className="text-sm font-bold text-slate-700">Microphone Access</span>
            </div>
            <button 
              onClick={() => toggle('mic')}
              className={`w-12 h-6 rounded-full transition-colors relative ${privacy.mic ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${privacy.mic ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl"><Bell size={20} /></div>
              <span className="text-sm font-bold text-slate-700">Push Notifications</span>
            </div>
            <button 
              onClick={() => toggle('notifications')}
              className={`w-12 h-6 rounded-full transition-colors relative ${privacy.notifications ? 'bg-teal-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${privacy.notifications ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </section>

      <section className="px-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">General</h2>
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx} 
                className={`w-full p-4 flex items-center justify-between group active:bg-slate-50 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-50 text-slate-500 rounded-xl group-active:text-teal-500"><Icon size={20} /></div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.value && <span className="text-xs text-slate-400 font-medium">{item.value}</span>}
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-6 mb-8">
        <button className="w-full flex items-center justify-center space-x-2 py-5 bg-rose-50 text-rose-500 rounded-3xl font-bold active:bg-rose-100 transition-colors">
          <LogOut size={20} />
          <span>Reset Local Data</span>
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
          MINDTRACK AI LABS • 2024 • ALL DATA STAYS ON DEVICE
        </p>
      </section>
    </div>
  );
};

export default Settings;
