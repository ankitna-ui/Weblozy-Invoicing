import React, { useState } from 'react';
import { 
  Zap, Mail, Clock, Repeat, Shield, Settings, 
  Plus, X, Save, CheckCircle2, AlertCircle,
  MessageCircle, Search, ArrowRight,
  TrendingUp, History
} from 'lucide-react';

// --- TYPES ---
interface AutomationRule {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'communication' | 'workflow' | 'finance';
  enabled: boolean;
  schedule: string;
  stats: string;
  color: string;
  tags: string[];
}

interface LogEntry {
  id: number;
  action: string;
  target: string;
  time: string;
  status: 'success' | 'failed' | 'pending';
}

// --- MOCK DATA ---
const INITIAL_RULES: AutomationRule[] = [
  {
    id: '1',
    title: 'Smart Payment Chaser',
    description: 'Send multi-channel reminders (Email + WhatsApp) for overdue invoices based on delay severity.',
    icon: Mail,
    type: 'communication',
    enabled: true,
    schedule: 'Daily at 10:00 AM',
    stats: '₹1.2L Recovered',
    color: 'bg-blue-500',
    tags: ['High Priority', 'Finance']
  },
  {
    id: '2',
    title: 'Recurring Invoice Engine',
    description: 'Automatically generate, sign, and send invoices for subscription-based clients.',
    icon: Repeat,
    type: 'finance',
    enabled: true,
    schedule: '1st of Month',
    stats: '12 Active Subs',
    color: 'bg-purple-500',
    tags: ['Billing', 'Time Saver']
  },
  {
    id: '3',
    title: 'Late Fee Auto-Apply',
    description: 'Automatically add 2% late fee if invoice remains unpaid 7 days post due date.',
    icon: AlertCircle,
    type: 'finance',
    enabled: false,
    schedule: 'Real-time Trigger',
    stats: 'Inactive',
    color: 'bg-amber-500',
    tags: ['Penalty', 'Revenue']
  },
  {
    id: '4',
    title: 'Customer Onboarding',
    description: 'Send a welcome kit and collect KYC documents when a new client is added.',
    icon: CheckCircle2,
    type: 'workflow',
    enabled: true,
    schedule: 'Instant',
    stats: '98% Success',
    color: 'bg-emerald-500',
    tags: ['Client Exp']
  },
  {
    id: '5',
    title: 'Low Inventory Alert',
    description: 'Notify admin when service hours or product stock drops below safety threshold.',
    icon: Shield,
    type: 'workflow',
    enabled: false,
    schedule: 'Hourly Check',
    stats: '-',
    color: 'bg-red-500',
    tags: ['Inventory']
  }
];

const MOCK_LOGS: LogEntry[] = [
  { id: 1, action: 'WhatsApp Reminder Sent', target: 'Sharma Traders (INV-001)', time: '12 mins ago', status: 'success' },
  { id: 2, action: 'Invoice Generated', target: 'TechSolutions (Monthly Retainer)', time: '2 hours ago', status: 'success' },
  { id: 3, action: 'Late Fee Calculation', target: 'Creative Studio (INV-009)', time: '5 hours ago', status: 'pending' },
  { id: 4, action: 'Email Delivery Failed', target: 'Amit Verma (Invalid Email)', time: 'Yesterday', status: 'failed' },
  { id: 5, action: 'Thank You Note Sent', target: 'Rahul Sharma (Payment Recvd)', time: 'Yesterday', status: 'success' },
];

// --- COMPONENT: CONFIG MODAL ---
const ConfigModal = ({ rule, onClose, onSave }: { rule: AutomationRule, onClose: () => void, onSave: (r: AutomationRule) => void }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Settings size={18} className="text-brand-600" />
                        Configure Automation
                    </h2>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" /></button>
                </div>
                
                <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Header Info */}
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <div className={`p-3 rounded-lg ${rule.color} text-white shadow-md`}>
                            <rule.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{rule.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rule.description}</p>
                        </div>
                    </div>

                    {/* Settings Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Trigger Condition</label>
                            <select className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-brand-500 outline-none">
                                <option>When Invoice is Due today</option>
                                <option>When Invoice is Overdue by 3 days</option>
                                <option>When Payment is Received</option>
                                <option>On a Specific Date</option>
                            </select>
                        </div>

                        {rule.type === 'communication' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Channels</label>
                                <div className="flex gap-3">
                                    <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 flex-1">
                                        <input type="checkbox" defaultChecked className="text-brand-600 focus:ring-brand-500 rounded bg-white dark:bg-slate-700" />
                                        <Mail size={16} className="text-slate-500 dark:text-slate-400"/>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 flex-1">
                                        <input type="checkbox" defaultChecked className="text-brand-600 focus:ring-brand-500 rounded bg-white dark:bg-slate-700" />
                                        <MessageCircle size={16} className="text-slate-500 dark:text-slate-400"/>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div>
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Action Template</label>
                             <div className="relative">
                                <textarea 
                                    rows={4} 
                                    className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                                    defaultValue="Hi {ClientName},&#10;&#10;This is a gentle reminder that invoice {InvoiceNumber} for ₹{Amount} was due on {DueDate}.&#10;&#10;Please make the payment at the earliest.&#10;&#10;Regards,&#10;Weblozy Team" 
                                />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500">{'{ClientName}'}</span>
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-500 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500">{'{Amount}'}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg flex items-start gap-2 border border-amber-100 dark:border-amber-800">
                        <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                            <strong>Note:</strong> Changes will apply to all future events. Past triggers will not be re-processed.
                        </p>
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">Cancel</button>
                    <button onClick={() => { onSave(rule); onClose(); }} className="px-5 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2">
                        <Save size={16} /> Save Configuration
                    </button>
                </div>
             </div>
        </div>
    )
}

// --- MAIN AUTOMATION COMPONENT ---
const Automation = () => {
    // State
    const [rules, setRules] = useState(INITIAL_RULES);
    const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules');
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header with Premium Gradient */}
            <div className="relative overflow-hidden bg-slate-900 dark:bg-black/60 rounded-2xl p-8 text-white shadow-xl">
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-wider">
                                PRO FEATURE
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Automation Engine</h1>
                        <p className="text-slate-400 max-w-xl">
                            Put your business on autopilot. Configure smart rules to handle invoicing, chasing payments, and client communication automatically.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-emerald-400">12h</div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wide">Time Saved/Mo</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-blue-400">34</div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wide">Tasks Auto-Run</div>
                        </div>
                    </div>
                 </div>
                 {/* Decorative background glow */}
                 <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
                 <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('rules')}
                    className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'rules' ? 'text-brand-700 dark:text-brand-400 border-b-2 border-brand-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Zap size={16} /> Active Rules
                </button>
                <button 
                    onClick={() => setActiveTab('logs')}
                    className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'logs' ? 'text-brand-700 dark:text-brand-400 border-b-2 border-brand-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <History size={16} /> Activity Log
                </button>
            </div>

            {/* RULES TAB CONTENT */}
            {activeTab === 'rules' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative max-w-xs">
                             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input type="text" placeholder="Search rules..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg">
                            <Plus size={16} /> Create New Rule
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rules.map((rule) => {
                            const Icon = rule.icon;
                            return (
                                <div key={rule.id} className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-200 flex flex-col ${rule.enabled ? 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md' : 'border-slate-100 dark:border-slate-700 opacity-70 grayscale-[0.5]'}`}>
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-lg ${rule.color} text-white shadow-md`}>
                                                <Icon size={24} />
                                            </div>
                                            <button 
                                                onClick={() => toggleRule(rule.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${rule.enabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        
                                        <div className="mb-2">
                                            {rule.tags.map(tag => (
                                                <span key={tag} className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded mr-2 mb-2">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{rule.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{rule.description}</p>
                                        
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} /> {rule.schedule}
                                            </div>
                                            <div className="h-3 w-px bg-slate-300 dark:bg-slate-600"></div>
                                            <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                                                <TrendingUp size={14} /> {rule.stats}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center rounded-b-xl">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{rule.enabled ? 'Active' : 'Paused'}</span>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedRule(rule)}
                                            className="text-sm font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
                                        >
                                            <Settings size={14} /> Configure
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* LOGS TAB CONTENT */}
            {activeTab === 'logs' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">System Activity Log</h3>
                        <div className="flex gap-2">
                             <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Filter by Date</button>
                             <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Export CSV</button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-700 z-0"></div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-700">
                            {MOCK_LOGS.map((log) => (
                                <div key={log.id} className="p-6 flex items-start gap-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative z-10 group">
                                    <div className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center shrink-0 mt-1
                                        ${log.status === 'success' ? 'bg-green-500' : log.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}
                                    `}>
                                        {log.status === 'success' && <CheckCircle2 size={10} className="text-white" />}
                                        {log.status === 'failed' && <X size={10} className="text-white" />}
                                        {log.status === 'pending' && <Clock size={10} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{log.action}</h4>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded border border-slate-100 dark:border-slate-600">{log.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{log.target}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 text-center">
                        <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Load Older Logs</button>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {selectedRule && (
                <ConfigModal 
                    rule={selectedRule} 
                    onClose={() => setSelectedRule(null)} 
                    onSave={(updatedRule) => {
                        console.log("Saving rule", updatedRule);
                        // Update logic would go here
                    }}
                />
            )}
        </div>
    );
};

export default Automation;