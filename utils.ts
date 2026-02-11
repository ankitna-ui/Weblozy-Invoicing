import { LineItem, TaxBreakdown, Client } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const HOME_STATE = "Maharashtra";

export const numberToWords = (price: number): string => {
  if (price === 0) return 'Zero';
  
  const sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const handle_tens = (d: number, trial: number): string => {
    let out = "";
    if (d === 0) return "";
    if (d > 0) {
      if (d >= 10 && d <= 19) {
        out += dblDigit[d - 10] + " ";
      } else {
        out += tensPlace[Math.floor(d / 10)] + " ";
        if (d % 10 > 0) out += sglDigit[d % 10] + " ";
      }
    }
    return out;
  };
  
  const convert = (n: number): string => {
    let out = "";
    if (n >= 10000000) {
      out += convert(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      out += convert(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      out += convert(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }
    if (n >= 100) {
      out += handle_tens(Math.floor(n / 100), 0) + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      out += handle_tens(n, 0);
    }
    return out;
  }
  
  return convert(Math.floor(price)) + " Only";
}

export const calculateTaxes = (items: LineItem[], clientState: string): TaxBreakdown => {
  let taxableValue = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  const isInterState = clientState.toLowerCase() !== HOME_STATE.toLowerCase();

  items.forEach(item => {
    // Calculate base amount after discount
    const baseAmount = item.rate * item.quantity;
    const discountAmount = baseAmount * (item.discount / 100);
    const itemTaxable = baseAmount - discountAmount;
    
    taxableValue += itemTaxable;

    const taxAmount = itemTaxable * (item.gstRate / 100);

    if (isInterState) {
      totalIGST += taxAmount;
    } else {
      totalCGST += taxAmount / 2;
      totalSGST += taxAmount / 2;
    }
  });

  const totalTax = totalIGST + totalCGST + totalSGST;
  const grandTotal = taxableValue + totalTax;
  const roundedTotal = Math.round(grandTotal);
  const roundOff = roundedTotal - grandTotal;

  return {
    taxableValue,
    cgst: totalCGST,
    sgst: totalSGST,
    igst: totalIGST,
    totalTax,
    grandTotal: roundedTotal,
    roundOff
  };
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const generateNumber = (prefix: string) => `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
    case 'Accepted': return 'bg-green-100 text-green-700 border-green-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Sent': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
    case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
    case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};