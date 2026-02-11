import React, { useState } from 'react';
import { Estimate, Client } from '../types';
import { DUMMY_ESTIMATES } from '../constants';
import { formatCurrency, getStatusColor, numberToWords } from '../utils';
import { 
  Plus, Search, Filter, MoreHorizontal, Eye, 
  FileCheck, Mail, Printer, ArrowRightCircle, Download, X, Share2
} from 'lucide-react';

interface EstimateListProps {
  onCreateEstimate: () => void;
  onConvertEstimate: (estimate: Estimate) => void;
}

// --- ESTIMATE PREVIEW MODAL ---
const EstimatePreviewModal = ({ estimate, onClose, onConvert }: { estimate: Estimate, onClose: () => void, onConvert: () => void }) => {
  if (!estimate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Estimate Preview 
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
                    {estimate.number}
                </span>
            </h2>
            <div className="flex gap-2">
                <button 
                  onClick={onConvert}
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 shadow-sm font-medium flex items-center gap-2 mr-2"
                >
                  <ArrowRightCircle size={16} /> Convert to Invoice
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-600 mx-1"></div>
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

        {/* Paper UI - Kept White for Realism */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/50 p-8 flex justify-center custom-scrollbar">
            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-10 text-slate-800 relative">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-8">
                    <div>
                        <div className="text-3xl font-bold text-brand-700 tracking-tight mb-2">Weblozy.</div>
                        <p className="text-sm text-slate-500 w-64">
                            404, Innovation Tower, Cyber City,<br/>
                            Pune, Maharashtra, 411001<br/>
                            GSTIN: 27AAAAA0000A1Z5
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-light text-slate-900 mb-2 tracking-wide">ESTIMATE</h1>
                        <p className="text-sm text-slate-500"># {estimate.number}</p>
                        <p className="text-sm text-slate-500">Date: {estimate.date}</p>
                        <p className="text-sm text-orange-600 font-medium mt-1">Valid Until: {estimate.validUntil}</p>
                    </div>
                </div>

                {/* Subject Line */}
                {estimate.subject && (
                   <div className="mb-8 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-2">Subject:</span>
                      <span className="text-sm font-semibold text-slate-800">{estimate.subject}</span>
                   </div>
                )}

                {/* Client Info */}
                <div className="flex justify-between mb-12">
                    <div className="w-1/2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimate For</h3>
                        <div className="font-bold text-lg text-slate-900">{estimate.clientDetails.name}</div>
                        {estimate.clientDetails.companyName && <div className="text-slate-600 font-medium">{estimate.clientDetails.companyName}</div>}
                        <div className="text-slate-500 text-sm mt-1 whitespace-pre-line">{estimate.clientDetails.address}</div>
                        {estimate.clientDetails.gstin && (
                            <div className="text-slate-600 text-sm mt-2 font-mono">GSTIN: {estimate.clientDetails.gstin}</div>
                        )}
                    </div>
                    <div className="w-1/3 text-right">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Amount</h3>
                        <div className="text-2xl font-bold text-slate-900">
                            {formatCurrency(estimate.taxBreakdown.grandTotal)}
                        </div>
                         <div className="mt-2 text-sm text-slate-500">
                            Status: <span className={`font-bold ${getStatusColor(estimate.status).replace('bg-', 'text-').replace('border-', '')}`}>{estimate.status}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="bg-slate-50 border-y border-slate-200">
                            <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 uppercase">Item Description</th>
                            <th className="py-3 px-4 text-center text-xs font-bold text-slate-500 uppercase">Qty</th>
                            <th className="py-3 px-4 text-right text-xs font-bold text-slate-500 uppercase">Rate</th>
                            <th className="py-3 px-4 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {estimate.items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-400">{item.description}</div>
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
                            <span>{formatCurrency(estimate.taxBreakdown.taxableValue)}</span>
                        </div>
                        
                        {estimate.taxBreakdown.igst > 0 ? (
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>IGST</span>
                                <span>{formatCurrency(estimate.taxBreakdown.igst)}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>CGST</span>
                                    <span>{formatCurrency(estimate.taxBreakdown.cgst)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>SGST</span>
                                    <span>{formatCurrency(estimate.taxBreakdown.sgst)}</span>
                                </div>
                            </>
                        )}
                        
                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-lg text-slate-900">Total Estimate</span>
                            <span className="font-bold text-xl text-brand-700">{formatCurrency(estimate.taxBreakdown.grandTotal)}</span>
                        </div>
                        <div className="text-right text-xs text-slate-400 italic">
                            Amount in words: {numberToWords(estimate.taxBreakdown.grandTotal)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-8 mt-auto">
                     <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Terms & Conditions</h4>
                        <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                            {estimate.terms || "Standard terms apply."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN LIST COMPONENT ---
const EstimateList: React.FC<EstimateListProps> = ({ onCreateEstimate, onConvertEstimate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  // Filter Logic
  const filteredEstimates = DUMMY_ESTIMATES.filter(est => {
    const matchesTab = activeTab === 'All' || est.status === activeTab;
    const searchText = searchQuery.toLowerCase();
    const matchesSearch = 
        est.number.toLowerCase().includes(searchText) || 
        est.clientDetails.name.toLowerCase().includes(searchText) ||
        est.subject?.toLowerCase().includes(searchText) ||
        est.subTotal.toString().includes(searchText);
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Estimates</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create and manage quotes for your clients</p>
        </div>
        <button onClick={onCreateEstimate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 shadow-lg shadow-brand-500/20 font-medium transition-all">
            <Plus size={18} /> Create New Estimate
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors duration-300">
        
        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-1 flex overflow-x-auto no-scrollbar">
            {['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Invoiced'].map(tab => (
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
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="relative w-full sm:max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search estimates..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-slate-900 dark:text-white"
                />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                <Filter size={16} /> Filter
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4">Estimate Details</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredEstimates.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div className="flex flex-col items-center">
                                    <FileCheck size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                                    <p>No estimates found.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                    {filteredEstimates.map((est) => (
                        <tr key={est.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span 
                                        onClick={() => setSelectedEstimate(est)}
                                        className="font-bold text-slate-800 dark:text-slate-200 text-sm cursor-pointer hover:text-brand-600 dark:hover:text-brand-400"
                                    >
                                        {est.number}
                                    </span>
                                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">{est.subject || 'No Subject'}</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5">{est.date}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{est.clientDetails.name}</div>
                                {est.clientDetails.companyName && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{est.clientDetails.companyName}</div>
                                )}
                                <div className="text-xs text-slate-400 truncate max-w-[150px]">{est.clientDetails.placeOfSupply}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(est.taxBreakdown.grandTotal)}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Tax: {formatCurrency(est.taxBreakdown.totalTax)}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(est.status)} shadow-sm`}>
                                    {est.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    {est.status === 'Accepted' && (
                                        <button 
                                            onClick={() => onConvertEstimate(est)}
                                            className="p-2 text-brand-600 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg transition-colors mr-2 flex items-center gap-1" title="Convert to Invoice"
                                        >
                                            <ArrowRightCircle size={14}/> <span className="text-xs font-bold">Invoice</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setSelectedEstimate(est)}
                                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="View"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setSelectedEstimate(est)}
                                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Print/Download"
                                    >
                                        <Printer size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* RENDER MODAL */}
      {selectedEstimate && (
        <EstimatePreviewModal 
            estimate={selectedEstimate} 
            onClose={() => setSelectedEstimate(null)}
            onConvert={() => onConvertEstimate(selectedEstimate)}
        />
      )}

    </div>
  );
};

export default EstimateList;