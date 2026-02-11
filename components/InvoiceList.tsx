import React, { useState, useMemo } from 'react';
import { Invoice, Client } from '../types';
import { DUMMY_INVOICES, DUMMY_CLIENTS } from '../constants';
import { formatCurrency, getStatusColor, numberToWords } from '../utils';
import { 
  Download, Eye, MoreHorizontal, Filter, Search, Plus, 
  CheckCircle2, Clock, AlertTriangle, ArrowUpRight, 
  X, Printer, Share2, Mail, Copy, Trash2
} from 'lucide-react';

// --- INVOICE PREVIEW MODAL COMPONENT ---
const InvoicePreviewModal = ({ invoice, client, onClose }: { invoice: Invoice, client: Client | undefined, onClose: () => void }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Invoice Preview 
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
                    {invoice.number}
                </span>
            </h2>
            <div className="flex gap-2">
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-brand-600 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all" title="Print">
                    <Printer size={18} />
                </button>
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-brand-600 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all" title="Share">
                    <Share2 size={18} />
                </button>
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-brand-600 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all" title="Download PDF">
                    <Download size={18} />
                </button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all ml-2">
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Invoice Paper UI - Kept White for Realism (Paper is white) */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/50 p-8 flex justify-center custom-scrollbar">
            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-10 text-slate-800 relative">
                
                {/* Status Watermark for unpaid */}
                {invoice.status === 'Overdue' && (
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-red-500/20 text-red-500/20 text-9xl font-black rotate-[-45deg] pointer-events-none uppercase tracking-widest z-0">
                        OVERDUE
                    </div>
                )}
                {invoice.status === 'Paid' && (
                    <div className="absolute top-10 right-10 border-2 border-green-600 text-green-600 text-lg font-bold px-4 py-1 rounded rotate-[-12deg] opacity-80">
                        PAID
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <div className="text-3xl font-bold text-brand-700 tracking-tight mb-2">Weblozy.</div>
                        <p className="text-sm text-slate-500 w-64">
                            404, Innovation Tower, Cyber City,<br/>
                            Pune, Maharashtra, 411001<br/>
                            GSTIN: 27AAAAA0000A1Z5
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-light text-slate-900 mb-2">INVOICE</h1>
                        <p className="text-sm text-slate-500"># {invoice.number}</p>
                        <p className="text-sm text-slate-500">Date: {invoice.date}</p>
                        {invoice.status !== 'Paid' && (
                             <p className="text-sm text-red-500 font-medium mt-1">Due Date: {invoice.dueDate}</p>
                        )}
                    </div>
                </div>

                {/* Client Info */}
                <div className="flex justify-between mb-12">
                    <div className="w-1/2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                        <div className="font-bold text-lg text-slate-900">{client?.name}</div>
                        {client?.companyName && <div className="text-slate-600 font-medium">{client.companyName}</div>}
                        <div className="text-slate-500 text-sm mt-1 whitespace-pre-line">{client?.address}</div>
                        {client?.gstin && (
                            <div className="text-slate-600 text-sm mt-2 font-mono">GSTIN: {client.gstin}</div>
                        )}
                    </div>
                    <div className="w-1/3 text-right">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Status</h3>
                        <div className={`text-xl font-bold ${invoice.status === 'Paid' ? 'text-green-600' : 'text-slate-900'}`}>
                            {invoice.status.toUpperCase()}
                        </div>
                        <div className="mt-2 text-sm text-slate-500">
                            Total Amount: <span className="text-slate-900 font-semibold">{formatCurrency(invoice.taxBreakdown.grandTotal)}</span>
                        </div>
                         <div className="text-sm text-slate-500">
                            Balance Due: <span className="text-slate-900 font-semibold">{formatCurrency(invoice.balanceDue)}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="bg-slate-50 border-y border-slate-200">
                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 uppercase">Item</th>
                            <th className="py-3 px-4 text-center text-xs font-bold text-slate-500 uppercase">Qty</th>
                            <th className="py-3 px-4 text-right text-xs font-bold text-slate-500 uppercase">Rate</th>
                            <th className="py-3 px-4 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoice.items && invoice.items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-400">HSN: {item.hsn}</div>
                                </td>
                                <td className="py-4 px-4 text-center text-slate-600">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-slate-600">{formatCurrency(item.rate)}</td>
                                <td className="py-4 px-4 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/2 space-y-3">
                        <div className="flex justify-between text-slate-500 text-sm">
                            <span>Subtotal</span>
                            <span>{formatCurrency(invoice.taxBreakdown.taxableValue)}</span>
                        </div>
                        
                        {invoice.taxBreakdown.igst > 0 ? (
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>IGST</span>
                                <span>{formatCurrency(invoice.taxBreakdown.igst)}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>CGST</span>
                                    <span>{formatCurrency(invoice.taxBreakdown.cgst)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>SGST</span>
                                    <span>{formatCurrency(invoice.taxBreakdown.sgst)}</span>
                                </div>
                            </>
                        )}
                        
                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-lg text-slate-900">Total</span>
                            <span className="font-bold text-xl text-brand-700">{formatCurrency(invoice.taxBreakdown.grandTotal)}</span>
                        </div>
                        <div className="text-right text-xs text-slate-400 italic">
                            Amount in words: {numberToWords(invoice.taxBreakdown.grandTotal)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-8 mt-auto">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Terms & Conditions</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                1. Payment is required within 15 days.<br/>
                                2. Please include invoice number on your check.<br/>
                            </p>
                        </div>
                         <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Bank Details</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Bank: HDFC Bank<br/>
                                A/c No: 50200012345678<br/>
                                IFSC: HDFC0000123
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};


// --- STATS CARD COMPONENT ---
const InvoiceStatCard = ({ title, value, count, type }: { title: string, value: string, count?: number, type: 'primary' | 'success' | 'warning' | 'danger' }) => {
    const colors = {
        primary: 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800',
        success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        danger: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    
    const Icon = type === 'success' ? CheckCircle2 : type === 'warning' ? Clock : type === 'danger' ? AlertTriangle : ArrowUpRight;

    return (
        <div className={`p-4 rounded-xl border ${colors[type]} flex flex-col justify-between transition-colors duration-300`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">{title}</span>
                <Icon size={16} className="opacity-80" />
            </div>
            <div>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                {count !== undefined && <div className="text-xs opacity-80 mt-1">{count} invoices</div>}
            </div>
        </div>
    );
};

interface InvoiceListProps {
  onCreateInvoice?: () => void;
}

// --- MAIN INVOICE LIST COMPONENT ---
const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateInvoice }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return DUMMY_INVOICES.filter(inv => {
        const matchesTab = activeTab === 'All' || inv.status === activeTab;
        const client = DUMMY_CLIENTS.find(c => c.id === inv.clientId);
        const searchText = searchQuery.toLowerCase();
        const matchesSearch = 
            inv.number.toLowerCase().includes(searchText) || 
            client?.name.toLowerCase().includes(searchText) ||
            client?.companyName?.toLowerCase().includes(searchText) ||
            inv.subTotal.toString().includes(searchText);
        
        return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Stats Logic
  const stats = useMemo(() => {
    const totalReceivables = DUMMY_INVOICES.filter(i => i.status !== 'Paid' && i.status !== 'Draft').reduce((acc, curr) => acc + curr.balanceDue, 0);
    const overdueAmount = DUMMY_INVOICES.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.balanceDue, 0);
    const collectedThisMonth = DUMMY_INVOICES.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amountPaid, 0);
    
    return { totalReceivables, overdueAmount, collectedThisMonth };
  }, []);

  const toggleSelectAll = () => {
      if (selectedInvoices.size === filteredInvoices.length) {
          setSelectedInvoices(new Set());
      } else {
          setSelectedInvoices(new Set(filteredInvoices.map(i => i.id)));
      }
  };

  const toggleSelectInvoice = (id: string) => {
      const newSet = new Set(selectedInvoices);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedInvoices(newSet);
  };

  const selectedInvoice = DUMMY_INVOICES.find(i => i.id === selectedInvoiceId);
  const selectedClient = selectedInvoice ? DUMMY_CLIENTS.find(c => c.id === selectedInvoice.clientId) : undefined;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage billing and track payments</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors font-medium">
                <Download size={18} /> Export Report
            </button>
            <button onClick={onCreateInvoice} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 shadow-lg shadow-brand-500/20 font-medium transition-all">
                <Plus size={18} /> Create Invoice
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InvoiceStatCard 
            title="Total Receivables" 
            value={formatCurrency(stats.totalReceivables)} 
            type="primary" 
          />
          <InvoiceStatCard 
            title="Overdue Amount" 
            value={formatCurrency(stats.overdueAmount)} 
            type="danger" 
            count={DUMMY_INVOICES.filter(i => i.status === 'Overdue').length}
          />
          <InvoiceStatCard 
            title="Collected (Month)" 
            value={formatCurrency(stats.collectedThisMonth)} 
            type="success" 
          />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Tabs & Toolbar */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-1 flex overflow-x-auto no-scrollbar">
            {['All', 'Paid', 'Pending', 'Overdue', 'Draft'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab 
                        ? 'border-brand-600 text-brand-700 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10' 
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="relative w-full sm:max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by Invoice #, Client Name or Amount..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-slate-900 dark:text-white"
                />
            </div>
            
            {/* Bulk Actions Header (Contextual) */}
            {selectedInvoices.size > 0 && (
                <div className="flex items-center gap-3 animate-fade-in bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-lg border border-brand-100 dark:border-brand-800 w-full sm:w-auto">
                    <span className="text-sm font-semibold text-brand-800 dark:text-brand-300">{selectedInvoices.size} selected</span>
                    <div className="h-4 w-px bg-brand-200 dark:bg-brand-700"></div>
                    <button className="text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 p-1" title="Email"><Mail size={18}/></button>
                    <button className="text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 p-1" title="Print"><Printer size={18}/></button>
                    <button className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 p-1" title="Delete"><Trash2 size={18}/></button>
                </div>
            )}
            
            {selectedInvoices.size === 0 && (
                 <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Filter size={16} /> Filter
                </button>
            )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4 w-10">
                            <input 
                                type="checkbox" 
                                className="rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
                                checked={selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4">Invoice Details</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredInvoices.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div className="flex flex-col items-center">
                                    <Search size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                                    <p>No invoices found matching your criteria.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    {filteredInvoices.map((invoice) => {
                        const client = DUMMY_CLIENTS.find(c => c.id === invoice.clientId);
                        const isSelected = selectedInvoices.has(invoice.id);
                        
                        return (
                            <tr key={invoice.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group ${isSelected ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <td className="px-6 py-4">
                                     <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
                                        checked={isSelected}
                                        onChange={() => toggleSelectInvoice(invoice.id)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer" onClick={() => setSelectedInvoiceId(invoice.id)}>
                                            {invoice.number}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{invoice.date}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {client?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{client?.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{client?.companyName || 'Individual'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.taxBreakdown.grandTotal)}</div>
                                    {invoice.balanceDue > 0 && (
                                        <div className="text-xs text-red-500 font-medium">Due: {formatCurrency(invoice.balanceDue)}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)} shadow-sm`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button 
                                            onClick={() => setSelectedInvoiceId(invoice.id)}
                                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" 
                                            title="Preview Invoice"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <div className="relative group/menu">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                            {/* Dropdown Menu (Hover based for demo) */}
                                            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 z-10 hidden group-hover/menu:block p-1">
                                                <button className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded flex items-center gap-2">
                                                    <Mail size={14}/> Send Reminder
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded flex items-center gap-2">
                                                    <Copy size={14}/> Duplicate
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2">
                                                    <Trash2 size={14}/> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
            <span>Showing {filteredInvoices.length} results</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
            </div>
        </div>
      </div>

      {/* Render Preview Modal */}
      {selectedInvoice && (
          <InvoicePreviewModal 
            invoice={selectedInvoice} 
            client={selectedClient} 
            onClose={() => setSelectedInvoiceId(null)} 
          />
      )}

    </div>
  );
};

export default InvoiceList;