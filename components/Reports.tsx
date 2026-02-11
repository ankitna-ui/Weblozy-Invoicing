import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  FileText, Download, Calendar, Filter, TrendingUp, 
  ArrowUpRight, ArrowDownRight, PieChart as PieIcon, AlertCircle
} from 'lucide-react';
import { MONTHLY_FINANCIAL_DATA, SALES_DISTRIBUTION, DUMMY_CLIENTS } from '../constants';
import { formatCurrency } from '../utils';

// --- MOCK DATA FOR ADVANCED CHARTS ---
const AGEING_DATA = [
  { range: '0-15 Days', amount: 45000, color: '#10b981' },
  { range: '16-30 Days', amount: 28000, color: '#3b82f6' },
  { range: '31-60 Days', amount: 12000, color: '#f59e0b' },
  { range: '60+ Days', amount: 8500, color: '#ef4444' },
];

const TOP_PRODUCTS = [
  { name: 'Web Dev', sales: 450000, count: 12 },
  { name: 'AMC', sales: 180000, count: 8 },
  { name: 'Marketing', sales: 150000, count: 5 },
  { name: 'Hosting', sales: 80000, count: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const GSTR_DATA = [
    { type: 'B2B Invoices', count: 12, taxable: 850000, tax: 153000, total: 1003000 },
    { type: 'B2C Large (>2.5L)', count: 2, taxable: 300000, tax: 54000, total: 354000 },
    { type: 'B2C Small', count: 45, taxable: 120000, tax: 21600, total: 141600 },
    { type: 'Credit/Debit Notes', count: 1, taxable: -5000, tax: -900, total: -5900 },
    { type: 'Exports', count: 0, taxable: 0, tax: 0, total: 0 },
];

// --- SUB-COMPONENTS ---

interface SummaryCardProps {
    title: string;
    value: string;
    subtext: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    icon: React.ElementType;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtext, trend, trendValue, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between transition-colors duration-300">
    <div>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100 flex flex-col items-center gap-1`}>
      <Icon size={20} className={color.replace('bg-', 'text-')} />
      {trend && (
        <span className={`text-[10px] font-bold flex items-center ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
           {trend === 'up' ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {trendValue}
        </span>
      )}
    </div>
  </div>
);

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gst' | 'sales' | 'ageing'>('overview');
  const [dateRange, setDateRange] = useState('This Financial Year');

  const renderContent = () => {
    switch (activeTab) {
        
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard 
                    title="Total Revenue" 
                    value={formatCurrency(1254000)} 
                    subtext="18% increase vs last year" 
                    trend="up" trendValue="18%"
                    icon={TrendingUp} color="bg-blue-500 text-blue-600"
                />
                <SummaryCard 
                    title="GST Collected" 
                    value={formatCurrency(225720)} 
                    subtext="Liability for March 2024" 
                    icon={FileText} color="bg-purple-500 text-purple-600"
                />
                <SummaryCard 
                    title="Profit Margin" 
                    value="32%" 
                    subtext="Net Profit: ₹4,01,280" 
                    trend="up" trendValue="2%"
                    icon={PieIcon} color="bg-green-500 text-green-600"
                />
                <SummaryCard 
                    title="Expenses" 
                    value={formatCurrency(852000)} 
                    subtext="Avg ₹71k / month" 
                    trend="down" trendValue="5%"
                    icon={ArrowDownRight} color="bg-orange-500 text-orange-600"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue & Expenses Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={MONTHLY_FINANCIAL_DATA}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2}/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val)=>`₹${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Area type="monotone" dataKey="income" name="Income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Sales by Category (B2B/B2C)</h3>
                    <div className="h-72 w-full flex items-center justify-center">
                         <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={SALES_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {SALES_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}/>
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'gst':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <p className="text-brand-200 text-xs font-bold uppercase tracking-wider mb-2">Total Tax Liability</p>
                        <h2 className="text-4xl font-bold">₹ 2,25,720</h2>
                        <p className="text-sm text-brand-300 mt-2">For FY 2024-25</p>
                    </div>
                    <div className="border-l border-white/20 pl-8 hidden md:block">
                         <p className="text-brand-200 text-xs font-bold uppercase tracking-wider mb-2">Input Tax Credit (ITC)</p>
                        <h2 className="text-3xl font-bold">₹ 45,200</h2>
                        <p className="text-sm text-brand-300 mt-2">Available for offset</p>
                    </div>
                    <div className="border-l border-white/20 pl-8 hidden md:block">
                        <p className="text-brand-200 text-xs font-bold uppercase tracking-wider mb-2">Net Payable</p>
                        <h2 className="text-3xl font-bold text-emerald-300">₹ 1,80,520</h2>
                        <button className="mt-3 px-4 py-1.5 bg-white text-brand-900 text-xs font-bold rounded-lg hover:bg-brand-50 transition-colors">
                            Pay Now
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 -mr-20 -mt-20"></div>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText size={18} className="text-brand-600 dark:text-brand-400"/> GSTR-1 Summary (Sales)
                    </h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-lg transition-colors border border-brand-200 dark:border-brand-800">
                        <Download size={14}/> Download JSON
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr className="text-right">
                            <th className="px-6 py-4 text-left">Section</th>
                            <th className="px-6 py-4">Count</th>
                            <th className="px-6 py-4">Taxable Value</th>
                            <th className="px-6 py-4">Total Tax</th>
                            <th className="px-6 py-4">Total Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {GSTR_DATA.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-right">
                                <td className="px-6 py-4 text-left font-medium text-slate-700 dark:text-slate-300">{row.type}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.count}</td>
                                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">{formatCurrency(row.taxable).replace('₹', '')}</td>
                                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">{formatCurrency(row.tax).replace('₹', '')}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(row.total).replace('₹', '')}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 font-bold text-right text-slate-800 dark:text-white">
                         <tr>
                            <td className="px-6 py-4 text-left">Total</td>
                            <td className="px-6 py-4">{GSTR_DATA.reduce((a,b)=>a+b.count,0)}</td>
                            <td className="px-6 py-4">{formatCurrency(GSTR_DATA.reduce((a,b)=>a+b.taxable,0))}</td>
                            <td className="px-6 py-4">{formatCurrency(GSTR_DATA.reduce((a,b)=>a+b.tax,0))}</td>
                            <td className="px-6 py-4">{formatCurrency(GSTR_DATA.reduce((a,b)=>a+b.total,0))}</td>
                        </tr>
                    </tfoot>
                </table>
             </div>
          </div>
        );

      case 'ageing':
        return (
             <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Receivables Ageing Report</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={AGEING_DATA} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2}/>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="range" type="category" width={100} tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none'}}/>
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                                        {AGEING_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center items-center text-center transition-colors duration-300">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{formatCurrency(20500)}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Total Overdue (> 30 Days)</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                            Recommended Action: Send payment reminders to "Sharma Traders" and 2 others immediately.
                        </p>
                        <button className="mt-6 px-6 py-2 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                            Send Reminders
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                        <h3 className="font-bold text-slate-800 dark:text-white">Client-wise Outstanding</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                             <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4 text-right">0-30 Days</th>
                                <th className="px-6 py-4 text-right">30-60 Days</th>
                                <th className="px-6 py-4 text-right">60+ Days</th>
                                <th className="px-6 py-4 text-right">Total Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {DUMMY_CLIENTS.filter(c => c.balance > 0).map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{client.name}</td>
                                    {/* Mock logic splitting balance for demo */}
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{formatCurrency(client.balance * 0.6)}</td>
                                    <td className="px-6 py-4 text-right text-amber-600 dark:text-amber-400 font-medium">{formatCurrency(client.balance * 0.3)}</td>
                                    <td className="px-6 py-4 text-right text-red-600 dark:text-red-400 font-bold">{formatCurrency(client.balance * 0.1)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(client.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        );

      case 'sales':
        return (
             <div className="space-y-6 animate-fade-in">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Top Selling Services</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={TOP_PRODUCTS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2}/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val)=>`₹${val/1000}k`} />
                                <Tooltip contentStyle={{borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', border: 'none'}} cursor={{fill: '#f8fafc'}}/>
                                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TOP_PRODUCTS.map((prod, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">#{idx+1}</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{prod.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{prod.count} units sold</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(prod.sales)}</div>
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Top Performer</div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Advanced reports & financial insights</p>
        </div>
        
        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
             <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors">
                <Calendar size={16} /> {dateRange}
             </button>
             <div className="w-px bg-slate-200 dark:bg-slate-600 my-1"></div>
             <button className="flex items-center gap-2 px-3 py-2 text-sm text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-900/20 rounded-md transition-colors">
                <Filter size={16} /> Filters
             </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 flex overflow-x-auto no-scrollbar gap-6">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-brand-600 text-brand-700 dark:text-brand-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('gst')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gst' ? 'border-brand-600 text-brand-700 dark:text-brand-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                GST Reports (GSTR-1)
            </button>
            <button 
                onClick={() => setActiveTab('ageing')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ageing' ? 'border-brand-600 text-brand-700 dark:text-brand-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                Ageing Analysis
            </button>
            <button 
                onClick={() => setActiveTab('sales')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'sales' ? 'border-brand-600 text-brand-700 dark:text-brand-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                Product Sales
            </button>
        </div>

        {/* Dynamic Content */}
        {renderContent()}

      </div>
    </div>
  );
};

export default Reports;