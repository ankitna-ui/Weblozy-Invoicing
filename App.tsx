import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EstimateForm from './components/EstimateForm';
import EstimateList from './components/EstimateList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import ClientList from './components/ClientList';
import Automation from './components/Automation';
import Reports from './components/Reports';
import { Menu } from 'lucide-react';
import { Estimate } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data State for passing between views
  const [invoiceInitialData, setInvoiceInitialData] = useState<any>(null);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showToast = (msg: string) => {
      setNotificationMsg(msg);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
  }

  const handleEstimateSave = (data: any) => {
    // In a real app, this would save to DB
    console.log("Saved Estimate with Client Snapshot:", data);
    showToast("Estimate saved successfully!");
    setCurrentView('estimates');
  };

  const handleInvoiceSave = (data: any) => {
    console.log("Saved Invoice:", data);
    showToast("Invoice generated successfully!");
    setInvoiceInitialData(null); // Clear temp data
    setCurrentView('invoices');
  }

  const handleConvertEstimate = (estimate: Estimate) => {
      // Map Estimate Data to Invoice Data structure
      const data = {
          clientDetails: estimate.clientDetails,
          items: estimate.items,
          notes: estimate.notes,
          // We can carry over more if needed
      };
      setInvoiceInitialData(data);
      setCurrentView('create-invoice');
      showToast(`Converting Estimate #${estimate.number} to Invoice...`);
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'estimates':
        return (
            <EstimateList 
                onCreateEstimate={() => setCurrentView('create-estimate')} 
                onConvertEstimate={handleConvertEstimate}
            />
        );
      case 'create-estimate':
        return <EstimateForm onSave={handleEstimateSave} onCancel={() => setCurrentView('estimates')} />;
      case 'create-invoice':
        return (
            <InvoiceForm 
                onSave={handleInvoiceSave} 
                onCancel={() => {
                    setInvoiceInitialData(null);
                    setCurrentView('invoices');
                }}
                initialData={invoiceInitialData}
            />
        );
      case 'invoices':
        return <InvoiceList onCreateInvoice={() => setCurrentView('create-invoice')} />;
      case 'clients':
        return <ClientList />;
      case 'automation':
        return <Automation />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
        
        {/* GLOBAL WATERMARK */}
        <div className="fixed inset-0 z-0 pointer-events-none flex items-start justify-center overflow-hidden opacity-[0.08] pt-24">
          <div className="text-slate-900 dark:text-white text-[15vw] font-black -rotate-12 select-none whitespace-nowrap">
            WEBLOZY
          </div>
        </div>

        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative z-10 custom-scrollbar">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center gap-2 font-bold text-xl text-brand-700 dark:text-brand-500">
               <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm shadow-brand-500/50 shadow-lg">W</div>
               Weblozy
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg active:bg-slate-200 dark:active:bg-slate-700 transition-colors">
              <Menu size={24} className="text-slate-700 dark:text-slate-300" />
            </button>
          </div>

          {renderContent()}
        </main>

        {/* Success Toast */}
        {showNotification && (
          <div className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce z-50">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <h4 className="font-semibold text-sm">Success</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">{notificationMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;