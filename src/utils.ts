export class Product {
  Name: string;
  UPS: string;
  Price: number;
}
export interface IDiscount {
  AfterTax: Boolean;
  Description: discount_type;
  Amount: number;
}

export interface IUPSDiscount extends IDiscount {
  Code: string;
}

export interface ICalculator {
  product: Product;
  PrintReport();
  CalculatePrice(tax: number, AdtiveDiscount?: Boolean): number;
}

export class Cost {
  Amount: number;
  Parcant: Boolean;
  Description: string;

  constructor(d: string, a: string) {
    this.Description = d;
    let extractedAmount = ExtractValueAndType(a);
    this.Amount = extractedAmount.Amount;
    this.Parcant = extractedAmount.Parcant;
  }
}

export function ExtractValueAndType(a: string) {
  a = a.trim();
  if (a.charAt(0) === '%')
    return { Amount: +a.substring(1, a.length) / 100, Parcant: true };
  else if (a.charAt(0) === '$')
    return { Amount: +a.substring(1, a.length), Parcant: false };
  else return { Amount: +a, Parcant: false };
}

export function MakePreice(num: number, p: number) {
  return +num.toFixed(p);
}

export enum discount_type {
  UNERVERSAL,
  UPS,
}

//prefer a flexible database instead
export enum Currancy {
  dollar = 'USD',
  yen = 'JPY',
  pound = 'GBP',
}
