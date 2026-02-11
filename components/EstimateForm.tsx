import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, FileCheck, ArrowRight, Calculator, RefreshCw, Calendar, User, MapPin, Building2, ChevronDown, PenSquare, FileText } from 'lucide-react';
import { Client, Product, LineItem, TaxBreakdown } from '../types';
import { DUMMY_CLIENTS, DUMMY_PRODUCTS, DEFAULT_TERMS } from '../constants';
import { calculateTaxes, formatCurrency, HOME_STATE, generateId, generateNumber, numberToWords } from '../utils';

interface EstimateFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const EstimateForm: React.FC<EstimateFormProps> = ({ onSave, onCancel }) => {
  // --- FORM META DATA ---
  const [estNumber, setEstNumber] = useState(generateNumber('EST'));
  const [estDate, setEstDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState('Draft');
  const [subject, setSubject] = useState('');

  // --- CLIENT DATA (Auto + Manual Override) ---
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientDetails, setClientDetails] = useState({
    name: '',
    address: '',
    gstin: '',
    placeOfSupply: HOME_STATE,
    email: '',
    phone: '',
    isManualOverride: false
  });

  // --- ITEMS & CALCULATIONS ---
  const [items, setItems] = useState<LineItem[]>([]);
  const [isGstEnabled, setIsGstEnabled] = useState(true);
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown>({
    taxableValue: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalTax: 0,
    roundOff: 0,
    grandTotal: 0
  });

  // --- TERMS & NOTES ---
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  // --- EFFECTS ---

  // Auto-fill client details when dropdown changes
  useEffect(() => {
    if (selectedClientId) {
      const client = DUMMY_CLIENTS.find(c => c.id === selectedClientId);
      if (client) {
        setClientDetails({
          name: client.name + (client.companyName ? ` (${client.companyName})` : ''),
          address: client.address,
          gstin: client.gstin || '',
          placeOfSupply: client.state,
          email: client.email || '',
          phone: client.phone || '',
          isManualOverride: false
        });
      }
    }
  }, [selectedClientId]);

  // Recalculate taxes whenever relevant data changes
  useEffect(() => {
    if (items.length > 0) {
      const breakdown = calculateTaxes(items, clientDetails.placeOfSupply);
      
      if (!isGstEnabled) {
        // GST Disabled manually
        const total = breakdown.taxableValue;
        setTaxBreakdown({
          taxableValue: total,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
          grandTotal: total,
          roundOff: 0
        });
      } else {
        setTaxBreakdown(breakdown);
      }
    } else {
      setTaxBreakdown({ taxableValue: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0, grandTotal: 0, roundOff: 0 });
    }
  }, [items, clientDetails.placeOfSupply, isGstEnabled]);

  // --- HANDLERS ---

  const handleClientFieldChange = (field: string, value: string) => {
    setClientDetails(prev => ({
      ...prev,
      [field]: value,
      isManualOverride: true // Flag that user customized this
    }));
  };

  const addItem = (product?: Product) => {
    const newItem: LineItem = {
      id: generateId(),
      productId: product?.id,
      name: product?.name || '',
      description: product?.description || '',
      hsn: product?.hsn || '',
      quantity: 1,
      rate: product?.rate || 0,
      discount: 0,
      gstRate: product?.gstRate || 18,
      amount: product?.rate || 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto-recalculate line amount
        const base = updatedItem.rate * updatedItem.quantity;
        const discountAmt = base * (updatedItem.discount / 100);
        updatedItem.amount = base - discountAmt;
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const isInterState = clientDetails.placeOfSupply.toLowerCase() !== HOME_STATE.toLowerCase();

  const handleSave = () => {
      const payload = {
          number: estNumber,
          date: estDate,
          validUntil,
          subject,
          status,
          // CRITICAL: We save the full client details snapshot here
          clientDetails: {
              name: clientDetails.name,
              address: clientDetails.address,
              gstin: clientDetails.gstin,
              placeOfSupply: clientDetails.placeOfSupply,
              email: clientDetails.email,
              phone: clientDetails.phone
          },
          items,
          taxBreakdown,
          notes,
          terms
      };
      onSave(payload);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-full animate-fade-in overflow-hidden transition-colors duration-300">
      
      {/* --- TOP BAR: ACTIONS --- */}
      <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 z-20">
        <div>
           <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">New Estimate</h2>
            <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-0.5">
                {['Draft', 'Sent'].map(s => (
                    <button 
                        key={s} 
                        onClick={() => setStatus(s)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${status === s ? 'bg-brand-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {s.toUpperCase()}
                    </button>
                ))}
            </div>
           </div>
           <p className="text-xs text-slate-500 dark:text-slate-400">Create comprehensive B2B/B2C estimates</p>
        </div>
        <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20">
                <FileCheck size={18} />
                Save Estimate
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            
            {/* --- SECTION 1: HEADER DETAILS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Estimate No.</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={estNumber} 
                            onChange={(e) => setEstNumber(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Date</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date" 
                            value={estDate} 
                            onChange={(e) => setEstDate(e.target.value)}
                            className="w-full pl-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Valid Until</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date" 
                            value={validUntil} 
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full pl-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: CLIENT DETAILS (Smart & Manual) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Client Select / Auto Fill */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <User size={18} className="text-brand-600 dark:text-brand-400" />
                        Bill To (Client)
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="mb-4">
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Search Client (or type manually below)</label>
                            <select 
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                            >
                                <option value="" disabled>Select a client to auto-fill...</option>
                                {DUMMY_CLIENTS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="space-y-3">
                            <input 
                                placeholder="Client Name / Company" 
                                value={clientDetails.name}
                                onChange={(e) => handleClientFieldChange('name', e.target.value)}
                                className="w-full text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-1 focus:border-brand-500 focus:outline-none placeholder-slate-400 font-medium"
                            />
                            <textarea 
                                placeholder="Billing Address" 
                                value={clientDetails.address}
                                onChange={(e) => handleClientFieldChange('address', e.target.value)}
                                rows={2}
                                className="w-full text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-1 focus:border-brand-500 focus:outline-none placeholder-slate-400 resize-none"
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">GSTIN</label>
                                    <input 
                                        placeholder="Unregistered" 
                                        value={clientDetails.gstin}
                                        onChange={(e) => handleClientFieldChange('gstin', e.target.value)}
                                        className="w-full text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-1 focus:border-brand-500 focus:outline-none uppercase font-mono text-slate-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold flex items-center gap-1">Place of Supply <MapPin size={10}/></label>
                                    <select 
                                        value={clientDetails.placeOfSupply}
                                        onChange={(e) => handleClientFieldChange('placeOfSupply', e.target.value)}
                                        className="w-full text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white py-1 focus:border-brand-500 focus:outline-none"
                                    >
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                        {/* Add all states in real app */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject & Settings Panel */}
                <div className="space-y-4 flex flex-col">
                     <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-brand-600 dark:text-brand-400" />
                        Estimate Details
                    </h3>
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col gap-4">
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Subject / Project Title</label>
                            <input 
                                placeholder="e.g., Website Redesign Project"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Visible on the PDF header</p>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                                <div>
                                    <div className="text-sm font-medium text-slate-800 dark:text-white">Tax Type</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {isGstEnabled 
                                            ? (isInterState ? "IGST (Inter-state)" : "CGST + SGST (Intra-state)") 
                                            : "No Tax Applied"
                                        }
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsGstEnabled(!isGstEnabled)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isGstEnabled ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}
                                >
                                    {isGstEnabled ? 'GST ON' : 'GST OFF'}
                                </button>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                                <div>
                                    <div className="text-sm font-medium text-slate-800 dark:text-white">Business Type</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Auto-detected from GSTIN</div>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                                    {clientDetails.gstin ? 'B2B' : 'B2C'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: LINE ITEMS (Fully Editable) --- */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Items & Services</h3>
                    <div className="flex gap-2">
                        {/* Quick Add Product Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                <Plus size={16} /> Add from Product List
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-600 hidden group-hover:block z-50 max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Select Product</div>
                                {DUMMY_PRODUCTS.map(p => (
                                    <div key={p.id} onClick={() => addItem(p)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                                        <div className="font-medium text-sm text-slate-800 dark:text-white">{p.name}</div>
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            <span>₹{p.rate}</span>
                                            <span>GST {p.gstRate}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => addItem()} className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded-lg text-sm text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                            <PenSquare size={16} /> Add Custom Item
                        </button>
                    </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-700">
                                <th className="px-4 py-3 w-[30%]">Item Description</th>
                                <th className="px-2 py-3 w-[10%]">HSN/SAC</th>
                                <th className="px-2 py-3 w-[10%] text-right">Qty</th>
                                <th className="px-2 py-3 w-[12%] text-right">Rate (₹)</th>
                                <th className="px-2 py-3 w-[10%] text-right">Disc %</th>
                                <th className="px-2 py-3 w-[10%] text-right">GST %</th>
                                <th className="px-4 py-3 w-[12%] text-right">Amount</th>
                                <th className="px-2 py-3 w-[6%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                                        No items added. Add a product or custom item to begin.
                                    </td>
                                </tr>
                            )}
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors">
                                    <td className="px-4 py-2 align-top">
                                        <input 
                                            type="text" 
                                            value={item.name} 
                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                            placeholder="Item Name"
                                            className="w-full font-medium text-slate-800 dark:text-slate-200 bg-transparent border-none focus:ring-0 p-0 text-sm placeholder-slate-300 dark:placeholder-slate-600"
                                        />
                                        <textarea 
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Description (optional)"
                                            rows={1}
                                            className="w-full text-xs text-slate-500 dark:text-slate-400 bg-transparent border-none focus:ring-0 p-0 mt-1 resize-none placeholder-slate-300 dark:placeholder-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 align-top">
                                        <input 
                                            type="text" 
                                            value={item.hsn} 
                                            onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                                            placeholder="HSN"
                                            className="w-full text-right text-sm text-slate-600 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-0 p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-2 align-top">
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                            className="w-full text-right text-sm font-medium bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-0 p-1 text-slate-900 dark:text-white"
                                        />
                                    </td>
                                    <td className="px-2 py-2 align-top">
                                        <input 
                                            type="number" 
                                            value={item.rate} 
                                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                            className="w-full text-right text-sm font-medium bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-0 p-1 text-slate-900 dark:text-white"
                                        />
                                    </td>
                                    <td className="px-2 py-2 align-top">
                                        <input 
                                            type="number" 
                                            value={item.discount} 
                                            onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                            className="w-full text-right text-sm text-slate-600 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-0 p-1"
                                        />
                                    </td>
                                    <td className="px-2 py-2 align-top">
                                        <select
                                            value={item.gstRate}
                                            onChange={(e) => updateItem(item.id, 'gstRate', parseFloat(e.target.value))}
                                            className="w-full text-right text-sm text-slate-600 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-brand-500 focus:outline-none focus:ring-0 p-1 appearance-none"
                                        >
                                            <option value="0">0%</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 align-top text-right font-mono text-slate-800 dark:text-slate-200 font-medium">
                                        {formatCurrency(item.amount)}
                                    </td>
                                    <td className="px-2 py-2 align-top text-center">
                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Add Item Button at bottom of table */}
                    <button onClick={() => addItem()} className="w-full py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors border-t border-slate-200 dark:border-slate-700 flex justify-center items-center gap-2">
                        <Plus size={16} /> Add Another Line Item
                    </button>
                </div>
            </div>

            {/* --- SECTION 4: FOOTER & TOTALS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Terms & Notes */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Notes for Client</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Thank you for your business..."
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none shadow-sm"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Terms & Conditions</label>
                        <textarea 
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none shadow-sm"
                            rows={4}
                        />
                    </div>
                </div>

                {/* Calculation Block */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 h-fit">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Subtotal (Taxable)</span>
                            <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(taxBreakdown.taxableValue)}</span>
                        </div>
                        
                        {isGstEnabled && (
                            <>
                                {isInterState ? (
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>IGST</span>
                                        <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(taxBreakdown.igst)}</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>CGST</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(taxBreakdown.cgst)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>SGST</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(taxBreakdown.sgst)}</span>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600 border-dashed">
                             <span>Round Off</span>
                             <span>{taxBreakdown.roundOff > 0 ? '+' : ''}{taxBreakdown.roundOff.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t border-slate-300 dark:border-slate-600">
                            <span className="text-lg font-bold text-slate-800 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-brand-700 dark:text-brand-400">{formatCurrency(taxBreakdown.grandTotal)}</span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mt-4 text-xs text-slate-500 dark:text-slate-400 text-center font-medium italic">
                            "{numberToWords(taxBreakdown.grandTotal)}"
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateForm;