import { Client, Product, Invoice, Estimate, LedgerEntry } from './types';

export const DUMMY_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    companyName: 'Sharma Traders',
    type: 'B2B',
    gstin: '27ABCDE1234F1Z5',
    email: 'rahul@sharmatraders.com',
    phone: '+91 98765 43210',
    address: '12, MG Road, Pune',
    state: 'Maharashtra',
    balance: 11200, // Matches invoice 3
    creditLimit: 100000,
    status: 'Active'
  },
  {
    id: 'c2',
    name: 'TechSolutions Pvt Ltd',
    companyName: 'TechSolutions',
    type: 'B2B',
    gstin: '24XYZAB5678G2Z1',
    email: 'accounts@techsolutions.in',
    phone: '+91 99887 76655',
    address: '404, Tech Park, Ahmedabad',
    state: 'Gujarat', // Inter-state example
    balance: 68000, // Matches invoice 2 balance
    creditLimit: 500000,
    status: 'Active'
  },
  {
    id: 'c3',
    name: 'Amit Verma',
    companyName: undefined, // Individual
    type: 'B2C',
    gstin: undefined,
    email: 'amit.v@gmail.com',
    phone: '+91 91234 56789',
    address: 'Flat 5, Sunshine Apts, Mumbai',
    state: 'Maharashtra',
    balance: 0,
    status: 'Active'
  },
  {
    id: 'c4',
    name: 'Sneha Gupta',
    companyName: 'Creative Studio',
    type: 'D2C',
    gstin: undefined,
    email: 'sneha@creative.com',
    phone: '+91 88888 99999',
    address: 'Sector 4, Bangalore',
    state: 'Karnataka',
    balance: 2200,
    status: 'Inactive'
  }
];

// Ledger Data corresponding to the Invoices
export const DUMMY_LEDGER_ENTRIES: LedgerEntry[] = [
    // Client 1: Sharma Traders
    { id: 'l1', clientId: 'c1', date: '2024-03-01', type: 'Opening Balance', reference: '-', description: 'Opening Balance b/f', debit: 0, credit: 0 },
    { id: 'l2', clientId: 'c1', date: '2024-03-01', type: 'Invoice', reference: 'INV-2425-001', description: 'Web Development Services', debit: 59000, credit: 0 },
    { id: 'l3', clientId: 'c1', date: '2024-03-05', type: 'Payment', reference: 'HDFC-8899', description: 'Received via NEFT', debit: 0, credit: 59000 },
    { id: 'l4', clientId: 'c1', date: '2024-03-10', type: 'Invoice', reference: 'INV-2425-003', description: 'Logo Design', debit: 11200, credit: 0 },
    
    // Client 2: TechSolutions
    { id: 'l5', clientId: 'c2', date: '2024-02-01', type: 'Opening Balance', reference: '-', description: 'Opening Balance b/f', debit: 15000, credit: 0 },
    { id: 'l6', clientId: 'c2', date: '2024-02-15', type: 'Payment', reference: 'UPI-123456', description: 'Part Payment Received', debit: 0, credit: 15000 },
    { id: 'l7', clientId: 'c2', date: '2024-03-05', type: 'Invoice', reference: 'INV-2425-002', description: 'Digital Marketing Package', debit: 118000, credit: 0 },
    { id: 'l8', clientId: 'c2', date: '2024-03-10', type: 'Payment', reference: 'CHEQUE-455', description: 'Payment Received', debit: 0, credit: 50000 },
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Web Development Service',
    sku: 'SRV-WEB',
    hsn: '998314',
    rate: 25000,
    gstRate: 18,
    unit: 'Project',
    description: 'Custom website development and deployment',
  },
  {
    id: 'p2',
    name: 'Annual Maintenance (AMC)',
    sku: 'SRV-AMC',
    hsn: '998719',
    rate: 12000,
    gstRate: 18,
    unit: 'Year',
    description: 'Yearly server maintenance and support',
  },
  {
    id: 'p3',
    name: 'Digital Marketing Package',
    sku: 'SRV-MKT',
    hsn: '998365',
    rate: 15000,
    gstRate: 18,
    unit: 'Month',
    description: 'SEO and Social Media Management',
  },
  {
    id: 'p4',
    name: 'Logo Design',
    sku: 'DSG-LOGO',
    hsn: '998314',
    rate: 5000,
    gstRate: 12, // Lower slab
    unit: 'Unit',
    description: 'Vector logo design with 3 iterations',
  },
  {
    id: 'p5',
    name: 'Hosting Server (Basic)',
    sku: 'HST-BSC',
    hsn: '998316',
    rate: 3500,
    gstRate: 18,
    unit: 'Year',
    description: 'Shared hosting plan',
  }
];

export const DEFAULT_TERMS = `1. This estimate is valid for 15 days.
2. 50% advance payment required to start work.
3. Delivery timeline starts after receipt of advance.
4. Subject to local jurisdiction only.`;

// Pre-filled data for dashboard
export const DUMMY_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    clientId: 'c1',
    number: 'INV-2425-001',
    date: '2024-03-01',
    dueDate: '2024-03-15',
    items: [
        { id: '1', name: 'Web Development Service', quantity: 2, rate: 25000, discount: 0, gstRate: 18, amount: 50000, hsn: '998314' }
    ],
    status: 'Paid',
    subTotal: 50000,
    taxBreakdown: { taxableValue: 50000, cgst: 4500, sgst: 4500, igst: 0, totalTax: 9000, grandTotal: 59000, roundOff: 0 },
    amountPaid: 59000,
    balanceDue: 0,
  },
  {
    id: 'inv2',
    clientId: 'c2',
    number: 'INV-2425-002',
    date: '2024-03-05',
    dueDate: '2024-03-20',
    items: [
        { id: '2', name: 'Digital Marketing Package', quantity: 1, rate: 100000, discount: 0, gstRate: 18, amount: 100000, hsn: '998365' }
    ],
    status: 'Pending',
    subTotal: 100000,
    taxBreakdown: { taxableValue: 100000, cgst: 0, sgst: 0, igst: 18000, totalTax: 18000, grandTotal: 118000, roundOff: 0 },
    amountPaid: 50000,
    balanceDue: 68000,
  },
  {
    id: 'inv3',
    clientId: 'c1',
    number: 'INV-2425-003',
    date: '2024-03-10',
    dueDate: '2024-03-25',
    items: [
        { id: '3', name: 'Logo Design', quantity: 2, rate: 5000, discount: 0, gstRate: 12, amount: 10000, hsn: '998314' }
    ],
    status: 'Overdue',
    subTotal: 10000,
    taxBreakdown: { taxableValue: 10000, cgst: 600, sgst: 600, igst: 0, totalTax: 1200, grandTotal: 11200, roundOff: 0 },
    amountPaid: 0,
    balanceDue: 11200,
  }
];

export const DUMMY_ESTIMATES: Estimate[] = [
    {
        id: 'est1',
        clientId: 'c1',
        number: 'EST-2425-001',
        subject: 'Website Redesign Proposal',
        date: '2024-03-20',
        validUntil: '2024-04-05',
        status: 'Sent',
        clientDetails: {
            name: 'Rahul Sharma (Sharma Traders)',
            address: '12, MG Road, Pune',
            placeOfSupply: 'Maharashtra',
            gstin: '27ABCDE1234F1Z5'
        },
        items: [
            { id: 'e1', name: 'UI/UX Design', quantity: 1, rate: 15000, discount: 0, gstRate: 18, amount: 15000, hsn: '998314' }
        ],
        subTotal: 15000,
        taxBreakdown: { taxableValue: 15000, cgst: 1350, sgst: 1350, igst: 0, totalTax: 2700, grandTotal: 17700, roundOff: 0 },
        notes: 'Looking forward to working with you.',
        terms: DEFAULT_TERMS
    },
    {
        id: 'est2',
        clientId: 'c3',
        number: 'EST-2425-002',
        subject: 'Home Automation Setup',
        date: '2024-03-22',
        validUntil: '2024-04-07',
        status: 'Accepted',
        clientDetails: {
            name: 'Amit Verma',
            address: 'Flat 5, Sunshine Apts, Mumbai',
            placeOfSupply: 'Maharashtra',
            gstin: ''
        },
        items: [
            { id: 'e2', name: 'Smart Switches', quantity: 10, rate: 2000, discount: 10, gstRate: 18, amount: 18000, hsn: '8536' }
        ],
        subTotal: 18000,
        taxBreakdown: { taxableValue: 18000, cgst: 1620, sgst: 1620, igst: 0, totalTax: 3240, grandTotal: 21240, roundOff: 0 },
        notes: 'Installation charges included.',
        terms: DEFAULT_TERMS
    }
];

export const MONTHLY_FINANCIAL_DATA = [
  { name: 'Jan', income: 45000, expense: 32000, profit: 13000 },
  { name: 'Feb', income: 52000, expense: 35000, profit: 17000 },
  { name: 'Mar', income: 61000, expense: 40000, profit: 21000 },
  { name: 'Apr', income: 58000, expense: 38000, profit: 20000 },
  { name: 'May', income: 75000, expense: 45000, profit: 30000 },
  { name: 'Jun', income: 82000, expense: 48000, profit: 34000 },
];

export const SALES_DISTRIBUTION = [
  { name: 'B2B', value: 70, fill: '#3b82f6' },
  { name: 'B2C', value: 20, fill: '#10b981' },
  { name: 'D2C', value: 10, fill: '#f59e0b' },
];

export const RECENT_ACTIVITY = [
  { id: 1, text: 'Invoice #INV-2425-001 paid by Sharma Traders', time: '2 hours ago', type: 'success' },
  { id: 2, text: 'New Estimate #EST-2425-005 created for TechSolutions', time: '5 hours ago', type: 'info' },
  { id: 3, text: 'Payment overdue for Invoice #INV-2425-003', time: '1 day ago', type: 'warning' },
  { id: 4, text: 'New Client "Creative Studio" added', time: '2 days ago', type: 'info' },
  { id: 5, text: 'Monthly GST Report generated', time: '3 days ago', type: 'success' },
];