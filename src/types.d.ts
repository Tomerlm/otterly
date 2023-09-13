/* 
    "תאריך רכישה": "date",
    "שם בית עסק": "business",
    "סכום עסקה": "dealAmount",
    "מטבע מקור": "currency",
    "סכום חיוב": "chargeAmount",
    "פירוט נוסף": "misc",
*/

type SupportedCurrencies = "₪";

export type TransactionData = {
  date: Date;
  business: string;
  dealAmount: number;
  currency: SupportedCurrencies;
  chargeAmount: number;
  misc?: string;
};
