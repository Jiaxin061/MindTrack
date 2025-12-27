
import React from 'react';
import { Watch, Smartphone, Plus, Battery, RefreshCw, ChevronRight } from 'lucide-react';
import { MOCK_DEVICES } from '../constants';

const Devices: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6 pb-24">
      <header className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-slate-800">My Devices</h1>
        <p className="text-sm text-slate-500">Connected health sensors</p>
      </header>

      <section className="px-6 space-y-4">
        {MOCK_DEVICES.map((device) => (
          <div key={device.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center space-x-4 shadow-sm">
            <div className="bg-slate-50 p-4 rounded-2xl text-teal-600">
              {device.type === 'watch' ? <Watch size={28} /> : <Smartphone size={28} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">{device.name}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'Connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{device.status}</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-400 space-x-1">
                  <Battery size={14} />
                  <span className="text-[10px] font-bold">{device.battery}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 flex items-center">
                  <RefreshCw size={10} className="mr-1" />
                  Synced {device.lastSync}
                </span>
                <button className="text-teal-600 font-bold text-xs">Settings</button>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full bg-white border-2 border-dashed border-slate-200 p-6 rounded-[32px] flex flex-col items-center justify-center space-y-2 active:bg-slate-50 transition-colors">
          <div className="bg-slate-100 p-3 rounded-full text-slate-400">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold text-slate-500">Connect New Device</span>
        </button>
      </section>

      <section className="px-6">
        <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
          <h4 className="font-bold text-emerald-800 text-sm mb-2">Sync Intelligence</h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            MindTrack automatically syncs with Apple Health, Google Fit, and Garmin to provide a holistic view of your physical exertion levels.
          </p>
          <div className="mt-4 flex items-center justify-between text-emerald-600 font-bold text-xs cursor-pointer group">
            <span>Configure data sources</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Devices;
