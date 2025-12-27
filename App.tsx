
import React, { useState } from 'react';
import { TabType } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Record from './screens/Record';
import Insights from './screens/Insights';
import Devices from './screens/Devices';
import Settings from './screens/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'record': return <Record />;
      case 'insights': return <Insights />;
      case 'devices': return <Devices />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 overflow-hidden flex flex-col relative border-x border-slate-100 shadow-2xl">
      {/* Background blobs for aesthetics */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-100/30 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 -left-32 w-72 h-72 bg-rose-100/20 blur-3xl rounded-full pointer-events-none"></div>
      
      {/* 
          Main area: 
          Removed z-10 to ensure the fixed BottomNav (now z-50) 
          correctly receives all tap/click events.
      */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {renderScreen()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
