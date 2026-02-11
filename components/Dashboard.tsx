import React from 'react';
import { 
  TrendingUp, IndianRupee, AlertCircle, FileCheck, ArrowUpRight, 
  ArrowDownRight, Plus, Users, Wallet, Activity, CalendarDays,
  MoreHorizontal, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { MONTHLY_FINANCIAL_DATA, SALES_DISTRIBUTION, RECENT_ACTIVITY, DUMMY_INVOICES } from '../constants';
import { formatCurrency, getStatusColor } from '../utils';

// --- COMPONENTS ---

const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, colorClass, borderClass }: any) => (
  <div className={`bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border ${borderClass} dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <div className="text-2xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">{value}</div>
    {subtext && <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-medium truncate">{subtext}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const totalReceivables = DUMMY_INVOICES.reduce((acc, inv) => acc + inv.balanceDue, 0);
  
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
                <CalendarDays size={14} /> 
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Good Morning, Admin 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here is your financial overview for today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                <Download size={18} /> Reports
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:scale-105">
                <Plus size={18} /> Create New
            </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(450200)} 
          subtext="Net profit: ₹1.2L"
          icon={IndianRupee} 
          colorClass="bg-gradient-to-br from-brand-500 to-brand-700"
          borderClass="border-brand-100"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard 
          title="Pending Collection" 
          value={formatCurrency(totalReceivables)} 
          subtext="From 3 invoices"
          icon={Wallet} 
          colorClass="bg-gradient-to-br from-amber-400 to-amber-600"
          borderClass="border-amber-100"
          trend="down"
          trendValue="5%"
        />
        <StatCard 
          title="GST Liability" 
          value={formatCurrency(28400)} 
          subtext="Due by 20th of month"
          icon={TrendingUp} 
          colorClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
          borderClass="border-indigo-100"
        />
        <StatCard 
          title="Active Clients" 
          value="142" 
          subtext="4 New this week"
          icon={Users} 
          colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600"
          borderClass="border-emerald-100"
          trend="up"
          trendValue="3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- MAIN CHART: CASH FLOW --- */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Financial Performance</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Income vs Expenses over last 6 months</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="flex items-center gap-1 px-2 dark:text-slate-200"><div className="w-2 h-2 rounded-full bg-brand-500"></div> Income</span>
                    <span className="flex items-center gap-1 px-2 dark:text-slate-200"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-500"></div> Expense</span>
                </div>
            </div>
            <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_FINANCIAL_DATA} barGap={0} barCategoryGap={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                            tickFormatter={(value) => `₹${value/1000}k`} 
                        />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar 
                            dataKey="income" 
                            fill="#6366f1" 
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                        />
                        <Bar 
                            dataKey="expense" 
                            fill="#cbd5e1" 
                            radius={[4, 4, 0, 0]} 
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* --- SECONDARY CHART: SALES SPLIT & GST --- */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-[320px] lg:h-[60%] flex flex-col transition-colors duration-300">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Sales Distribution</h3>
                <div className="flex-1 min-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={SALES_DISTRIBUTION}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {SALES_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-brand-400"/> GST Snapshot</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-sm text-slate-300">CGST + SGST</span>
                            <span className="font-mono font-bold">₹ 12,400</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-sm text-slate-300">IGST</span>
                            <span className="font-mono font-bold">₹ 16,000</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-sm font-bold text-brand-300">Total Liability</span>
                            <span className="font-mono font-bold text-lg text-brand-300">₹ 28,400</span>
                        </div>
                     </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
            </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: LISTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* RECENT INVOICES */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Invoices</h3>
                <button className="text-brand-600 dark:text-brand-400 text-sm font-bold hover:bg-brand-50 dark:hover:bg-brand-900/20 px-3 py-1 rounded-lg transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Invoice #</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {DUMMY_INVOICES.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200 text-sm">{inv.number}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {/* Usually we lookup client name, simplifying for dash display */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">C</div>
                                        <span>Client {inv.clientId}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{inv.date}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right">{formatCurrency(inv.taxBreakdown.grandTotal)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* ACTIVITY FEED */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Activity Feed</h3>
                <MoreHorizontal size={20} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
                {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="relative pl-10">
                        <div className={`absolute left-2.5 top-0.5 w-5 h-5 -ml-2.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center
                            ${activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-amber-500' : 'bg-brand-500'}
                        `}>
                            {/* Tiny dot center */}
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{activity.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-8 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                View Full Log
            </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;