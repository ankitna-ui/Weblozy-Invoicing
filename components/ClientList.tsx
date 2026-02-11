import React, { useState, useEffect } from 'react';
import { DUMMY_CLIENTS, DUMMY_LEDGER_ENTRIES } from '../constants';
import { Client, LedgerEntry, BusinessType } from '../types';
import { formatCurrency, generateId, HOME_STATE } from '../utils';
import { 
  Search, Plus, Filter, User, 
  Phone, Mail, Building2,
  Download, Printer, FileText, ArrowLeft,
  ChevronRight, Wallet, Edit, Trash2, X, Save,
  CheckCircle2
} from 'lucide-react';

// --- TYPES FOR LOCAL STATE ---
interface ClientFormState {
    name: string;
    companyName: string;
    gstin: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    type: BusinessType;
    creditLimit: number;
}

// --- CLIENT FORM MODAL ---
const ClientFormModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (client: Client) => void; 
    initialData?: Client | null;
}) => {
    const [formData, setFormData] = useState<ClientFormState>({
        name: '',
        companyName: '',
        gstin: '',
        email: '',
        phone: '',
        address: '',
        state: HOME_STATE,
        type: 'B2C',
        creditLimit: 0
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    companyName: initialData.companyName || '',
                    gstin: initialData.gstin || '',
                    email: initialData.email,
                    phone: initialData.phone,
                    address: initialData.address,
                    state: initialData.state,
                    type: initialData.type,
                    creditLimit: initialData.creditLimit || 0
                });
            } else {
                // Reset for new client
                setFormData({
                    name: '', companyName: '', gstin: '', email: '', phone: '', 
                    address: '', state: HOME_STATE, type: 'B2C', creditLimit: 0
                });
            }
        }
    }, [isOpen, initialData]);

    // Auto-detect business type based on GSTIN
    useEffect(() => {
        if (formData.gstin.length > 2) {
            setFormData(prev => ({ ...prev, type: 'B2B' }));
        } else if (!initialData) {
            setFormData(prev => ({ ...prev, type: 'B2C' }));
        }
    }, [formData.gstin, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData ? initialData.id : generateId(),
            ...formData,
            balance: initialData ? initialData.balance : 0, // Preserve balance or init 0
            status: 'Active',
            companyName: formData.companyName || undefined,
            gstin: formData.gstin || undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        {initialData ? 'Edit Client' : 'Add New Client'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><User size={12}/> Basic Details</h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Client Name <span className="text-red-500">*</span></label>
                                <input 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Company Name</label>
                                <input 
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="e.g. Sharma Traders"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Phone <span className="text-red-500">*</span></label>
                                    <input 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                        placeholder="+91..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email</label>
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                        placeholder="client@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business & Tax Info */}
                        <div className="space-y-4">
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Building2 size={12}/> Tax & Billing</h3>
                             <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">GSTIN</label>
                                <input 
                                    value={formData.gstin}
                                    onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
                                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none uppercase font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="27ABCDE1234..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as BusinessType})}
                                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="B2B">B2B (Business)</option>
                                        <option value="B2C">B2C (Consumer)</option>
                                        <option value="D2C">D2C (Direct)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">State</label>
                                    <select 
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Address</label>
                                <textarea 
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    rows={2}
                                    className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="Full billing address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
                            <Save size={18} /> Save Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- TRANSACTION FORM MODAL ---
interface TransactionData {
    date: string;
    type: string;
    amount: number;
    ref: string;
    desc: string;
}

const TransactionModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    clientName 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (data: TransactionData) => void; 
    clientName: string;
}) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Payment');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [ref, setRef] = useState('');
    const [desc, setDesc] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6 transition-colors duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Record Transaction for {clientName}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Transaction Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="button"
                                onClick={() => setType('Payment')}
                                className={`py-2 px-3 text-sm font-bold rounded-lg border ${type === 'Payment' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
                            >
                                Payment Received
                            </button>
                            <button 
                                type="button"
                                onClick={() => setType('Credit Note')}
                                className={`py-2 px-3 text-sm font-bold rounded-lg border ${type === 'Credit Note' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
                            >
                                Credit Note (Adjustment)
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Date</label>
                             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                        </div>
                         <div>
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Amount</label>
                             <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none focus:border-brand-500 font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Reference / Cheque No.</label>
                        <input type="text" value={ref} onChange={e => setRef(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. UPI-12345" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Description</label>
                        <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none focus:border-brand-500 resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="Notes..." />
                    </div>
                    <button 
                        onClick={() => {
                            onSave({ date, type, amount: parseFloat(amount), ref, desc });
                            onClose();
                        }}
                        className="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-lg"
                    >
                        Save Transaction
                    </button>
                </div>
             </div>
        </div>
    )
}

// --- LEDGER VIEW COMPONENT ---
const LedgerView = ({ 
    client, 
    onBack, 
    entries, 
    onAddEntry 
}: { 
    client: Client, 
    onBack: () => void, 
    entries: LedgerEntry[], 
    onAddEntry: (entry: TransactionData) => void 
}) => {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  // Calculate running balance logic
  let runningBalance = 0;
  // Sort entries by date first
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const entriesWithBalance = sortedEntries.map(entry => {
    runningBalance = runningBalance + entry.debit - entry.credit;
    return { ...entry, balance: runningBalance };
  });

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <ArrowLeft size={18} /> <span className="font-medium text-sm">Back</span>
            </button>
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsTxModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 shadow-sm font-bold"
                >
                    <Plus size={16} /> Record Transaction
                </button>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-2"></div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Printer size={16} /> Print
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Download size={16} /> PDF
                </button>
            </div>
        </div>

        {/* Client Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl font-bold border border-brand-100 dark:border-brand-800 shadow-sm">
                        {client.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
                        {client.companyName && <p className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1"><Building2 size={12}/> {client.companyName}</p>}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded border border-slate-100 dark:border-slate-600"><Mail size={12}/> {client.email}</span>
                            <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded border border-slate-100 dark:border-slate-600"><Phone size={12}/> {client.phone}</span>
                            {client.gstin && <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 font-mono text-xs text-slate-700 dark:text-slate-300 font-bold">GST: {client.gstin}</span>}
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                    <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Closing Balance</div>
                        <div className={`text-3xl font-bold ${client.balance > 0 ? 'text-red-600 dark:text-red-400' : client.balance < 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>
                            {formatCurrency(Math.abs(client.balance))}
                        </div>
                        <div className={`text-xs font-bold mt-1 ${client.balance > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                            {client.balance > 0 ? 'DR (To Collect)' : client.balance < 0 ? 'CR (Advance)' : 'Settled'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
             <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><FileText size={18} className="text-brand-600"/> Transaction History</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
                    FY 2024-2025
                </div>
             </div>
             <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-3 w-32">Date</th>
                        <th className="px-6 py-3">Particulars</th>
                        <th className="px-6 py-3 w-32">Type</th>
                        <th className="px-6 py-3 w-32">Ref No</th>
                        <th className="px-6 py-3 text-right">Debit (₹)</th>
                        <th className="px-6 py-3 text-right">Credit (₹)</th>
                        <th className="px-6 py-3 text-right">Balance (₹)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {entriesWithBalance.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div className="flex flex-col items-center">
                                    <Wallet size={48} className="text-slate-200 dark:text-slate-700 mb-2"/>
                                    <p>No transactions found.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        entriesWithBalance.map(entry => (
                             <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{entry.date}</td>
                                <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{entry.description}</td>
                                <td className="px-6 py-3 text-sm">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                        entry.type === 'Invoice' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' :
                                        entry.type === 'Payment' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' :
                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                    }`}>
                                        {entry.type}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{entry.reference}</td>
                                <td className="px-6 py-3 text-right text-sm text-slate-800 dark:text-white font-medium">
                                    {entry.debit > 0 ? formatCurrency(entry.debit).replace('₹', '') : '-'}
                                </td>
                                <td className="px-6 py-3 text-right text-sm text-green-600 dark:text-green-400 font-medium">
                                    {entry.credit > 0 ? formatCurrency(entry.credit).replace('₹', '') : '-'}
                                </td>
                                <td className="px-6 py-3 text-right text-sm font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/30">
                                    {formatCurrency(Math.abs(entry.balance)).replace('₹', '')} {entry.balance > 0 ? 'Dr' : entry.balance < 0 ? 'Cr' : ''}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
             </table>
        </div>

        {/* Transaction Modal */}
        <TransactionModal 
            isOpen={isTxModalOpen} 
            onClose={() => setIsTxModalOpen(false)}
            clientName={client.name}
            onSave={onAddEntry}
        />
    </div>
  );
};

// --- MAIN CLIENT LIST COMPONENT ---
const ClientList = () => {
  // State Management (CRUD)
  const [clients, setClients] = useState<Client[]>(DUMMY_CLIENTS);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(DUMMY_LEDGER_ENTRIES);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Filtering
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReceivables = clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);

  // --- CRUD HANDLERS ---

  const triggerToast = (msg: string) => {
      setToastMsg(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveClient = (client: Client) => {
      if (editingClient) {
          // Update
          setClients(clients.map(c => c.id === client.id ? client : c));
          triggerToast('Client updated successfully');
      } else {
          // Create
          setClients([client, ...clients]);
          triggerToast('New client added successfully');
      }
      setIsFormOpen(false);
      setEditingClient(null);
  };

  const handleDeleteClient = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm('Are you sure you want to delete this client?')) {
          setClients(clients.filter(c => c.id !== id));
          triggerToast('Client deleted');
      }
  };

  const handleEditClick = (client: Client, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingClient(client);
      setIsFormOpen(true);
  };

  const handleAddTransaction = (data: TransactionData) => {
      if (!selectedClient) return;

      const newEntry: LedgerEntry = {
          id: generateId(),
          clientId: selectedClient.id,
          date: data.date,
          type: data.type as 'Payment' | 'Credit Note', // Simplified for demo, actual app would handle types better
          reference: data.ref || 'MANUAL',
          description: data.desc || 'Manual Entry',
          debit: 0,
          credit: data.amount // Assuming payment/credit note reduces balance
      };

      // Add entry
      setLedgerEntries([...ledgerEntries, newEntry]);
      
      // Update Client Balance
      const balanceChange = -data.amount; // Credit reduces receivable
      const updatedClient = { ...selectedClient, balance: selectedClient.balance + balanceChange };
      
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      setSelectedClient(updatedClient); // Update local view
      
      triggerToast('Transaction recorded successfully');
  };

  // --- RENDER ---

  if (selectedClient) {
      return (
        <LedgerView 
            client={selectedClient} 
            onBack={() => setSelectedClient(null)} 
            entries={ledgerEntries.filter(l => l.clientId === selectedClient.id)}
            onAddEntry={handleAddTransaction}
        />
      );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clients & Ledger</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage customer profiles and view financial history</p>
        </div>
        <button 
            onClick={() => { setEditingClient(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 shadow-lg shadow-brand-500/20 font-medium transition-all"
        >
            <Plus size={18} /> Add New Client
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <User size={24} />
            </div>
            <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Clients</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{clients.length}</div>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors duration-300">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <Wallet size={24} />
            </div>
            <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Receivables</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalReceivables)}</div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px] transition-colors duration-300">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="relative w-full sm:max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search clients by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-slate-900 dark:text-white"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Filter size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Download size={16} /> Export
                </button>
            </div>
        </div>

        {/* Client List Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Contact Info</th>
                        <th className="px-6 py-4">GSTIN / Type</th>
                        <th className="px-6 py-4 text-right">Receivables</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredClients.length === 0 && (
                        <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div className="flex flex-col items-center">
                                    <User size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                                    <p>No clients found. Add a new client to get started.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer" onClick={() => setSelectedClient(client)}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors border border-slate-200 dark:border-slate-600">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-brand-600 transition-colors">{client.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{client.companyName || 'Individual'}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Mail size={12} className="text-slate-400"/> {client.email}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {client.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 inline-block px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 uppercase">
                                    {client.gstin || 'Unregistered'}
                                </div>
                                <div className="mt-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${client.type === 'B2B' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'}`}>
                                        {client.type}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className={`text-sm font-bold ${client.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                                    {formatCurrency(client.balance)}
                                </div>
                                <div className="text-[10px] text-slate-400">{client.balance > 0 ? 'Pending' : 'Clear'}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={(e) => handleEditClick(client, e)}
                                        className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                        title="Edit Client"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteClient(client.id, e)}
                                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Client"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 rounded-lg">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* MODALS */}
      <ClientFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveClient}
        initialData={editingClient}
      />

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default ClientList;