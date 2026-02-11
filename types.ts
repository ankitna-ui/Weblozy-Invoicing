export type BusinessType = 'B2B' | 'B2C' | 'D2C';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';
export type EstimateStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Invoiced';

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  gstin?: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  type: BusinessType;
  balance: number; // Current outstanding balance
  creditLimit?: number;
  status: 'Active' | 'Inactive';
}

export interface ClientDetailsSnapshot {
  name: string;
  companyName?: string;
  gstin?: string;
  address: string;
  placeOfSupply: string;
  email?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  hsn: string;
  rate: number;
  gstRate: number; // Percentage (e.g., 18)
  unit: string;
  description: string;
}

export interface LineItem {
  id: string;
  productId?: string; // Optional for custom items
  name: string; // Snapshot of product name
  description?: string;
  hsn: string;
  quantity: number;
  rate: number; // Snapshot of rate
  discount: number; // Percentage
  gstRate: number;
  amount: number; // (rate * quantity) - discount
}

export interface TaxBreakdown {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
}

export interface Estimate {
  id: string;
  clientId?: string;
  clientDetails: ClientDetailsSnapshot; // Saved snapshot
  number: string;
  subject?: string; // New field for context
  date: string;
  validUntil: string;
  items: LineItem[];
  status: EstimateStatus;
  subTotal: number;
  taxBreakdown: TaxBreakdown;
  notes: string;
  terms: string;
}

export interface Invoice {
  id: string;
  estimateId?: string; // If converted from estimate
  clientId: string;
  number: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  status: InvoiceStatus;
  subTotal: number;
  taxBreakdown: TaxBreakdown;
  amountPaid: number;
  balanceDue: number;
}

export interface LedgerEntry {
  id: string;
  clientId: string;
  date: string;
  type: 'Invoice' | 'Payment' | 'Opening Balance' | 'Credit Note';
  reference: string;
  description: string;
  debit: number;  // Amount Receivable (Invoice)
  credit: number; // Amount Received (Payment)
}

export interface AutomationSettings {
  autoInvoice: boolean;
  autoEmail: boolean;
  autoWhatsapp: boolean;
  paymentReminders: boolean;
  recurringBilling: boolean;
}