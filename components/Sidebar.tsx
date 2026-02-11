import React from 'react';
import { LayoutDashboard, FileText, Users, FilePlus, Receipt, Settings, BarChart3, PieChart, X, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, onClose, isDarkMode, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'estimates', label: 'Estimates', icon: FilePlus },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients / Ledger', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'automation', label: 'Automation', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    if (window.innerWidth < 768) {
      onClose(); // Close sidebar on mobile after selection
    }
  };

  return (
    <>
        {/* Sidebar Container */}
        <div className={`
            fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30
            flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0
        `}>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-brand-500/50 shadow-lg">W</div>
                <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Weblozy</span>
                </div>
                {/* Mobile Close Button */}
                <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                    <X size={24} />
                </button>
            </div>

            <div className="px-6 py-2 md:hidden">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Navigation</div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                    <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 shadow-sm ring-1 ring-brand-200 dark:ring-brand-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    >
                    <Icon size={20} className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'} />
                    {item.label}
                    </button>
                );
                })}
            </nav>

            {/* Dark Mode Toggle & Pro Plan */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Dark Mode Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-brand-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200 ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} style={{left: isDarkMode ? '18px' : '2px'}}></div>
                  </div>
                </button>

                <div className="bg-slate-900 dark:bg-black/40 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all border border-transparent dark:border-slate-800">
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-sm">Pro Plan</h4>
                          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 group-hover:text-slate-200 transition-colors">Valid until Dec 2024</p>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500 rounded-full blur-xl opacity-20 -mr-4 -mt-4 group-hover:opacity-30 transition-opacity"></div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Sidebar;