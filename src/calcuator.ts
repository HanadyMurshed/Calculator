import {
  Product,
  MakePreice,
  Currancy,
  ExtractValueAndType,
  discount_type,
  ICalculator,
  IUPSDiscount,
  IDiscount,
  Cost,
} from '../src/utils';

export class Order implements ICalculator {
  product: Product;
  private discountBeforeTaxList: IDiscount[];
  private discountAfterTaxList: IDiscount[];
  private costs: Cost[];
  private report: {};
  private cap: number;
  private p: number;
  private fb: number;
  private currancy: Currancy;

  constructor(p: Product) {
    this.product = p;
    this.costs = [];
    this.report = {};
    this.discountAfterTaxList = [];
    this.discountBeforeTaxList = [];
    this.p = 2; //preseison digit
    this.fb = 2; //final preseison
  }

  SetPresision(p: number) {
    if (p !== undefined && p !== 0) this.p = p;
  }

  SetCurrancy(c: Currancy) {
    if (c !== undefined) this.currancy = c;
  }

  SetDiscountLimit(cap: string) {
    if (cap !== undefined && cap.length !== 0) {
      let c = ExtractValueAndType(cap);
      if (c.Parcant) this.cap = c.Amount * this.product.Price;
      else this.cap = c.Amount;
    }
  }

  AddCost(cost: Cost) {
    if (cost !== undefined && cost.Amount !== 0) this.costs.push(cost);
  }
  //Two discount ere introduced but there may be much more
  AddDiscount(discount: IDiscount) {
    if (discount !== undefined && discount.Amount !== 0)
      if (discount.AfterTax) this.discountAfterTaxList.push(discount);
      else this.discountBeforeTaxList.push(discount);
  }

  private CalculateCost(): number {
    let totalCost = 0;
    let c = 0;

    for (let i in this.costs) {
      if (this.costs[i].Parcant) {
        c = MakePreice(this.costs[i].Amount * this.product.Price, this.p);
        totalCost += c;
        this.Report(this.costs[i].Description, MakePreice(c, this.fb));
      } else {
        totalCost += this.costs[i].Amount;
        this.Report(
          this.costs[i].Description,
          MakePreice(this.costs[i].Amount, this.fb),
        );
      }
    }

    return +totalCost.toFixed(this.p);
  }

  private CalculateTax(tax: number): number {
    if (tax === undefined) return 0;
    return MakePreice(this.product.Price * tax, this.p);
  }

  private CalculateDiscount(discount: IDiscount): number {
    if (discount === undefined) return 0;

    if (
      discount.Description === discount_type.UPS &&
      (discount as IUPSDiscount).Code !== this.product.UPS
    )
      return 0;

    return MakePreice(this.product.Price * discount.Amount, this.p);
  }

  private ClearReport() {
    this.report = {};
  }

  private CalculatePriceAdtiveDiscount(tax: number): number {
    this.Report('Cost', this.product.Price);

    let p = this.product.Price;
    let discountBefore = 0;
    let discountAfter = 0;
    let discountExceededCap = false;

    for (let i in this.discountBeforeTaxList) {
      discountBefore += this.CalculateDiscount(this.discountBeforeTaxList[i]);
    }

    if (discountBefore > this.cap) {
      this.product.Price -= this.cap;
      discountExceededCap = true;
    } else this.product.Price -= discountBefore;

    let t = this.CalculateTax(tax);
    let c = this.CalculateCost();

    for (let i in this.discountAfterTaxList) {
      discountAfter += this.CalculateDiscount(this.discountAfterTaxList[i]);
    }

    this.Report('Tax', MakePreice(t, this.fb));
    this.Report(
      'Discount',
      MakePreice(discountAfter + discountBefore, this.fb),
    );

    if (!discountExceededCap) {
      if (discountAfter + discountBefore > this.cap) {
        this.product.Price -= this.cap - discountBefore;
        this.Report('new discount', this.cap);
      } else {
        this.product.Price -= discountAfter;
      }
    }

    let temp = this.product.Price;
    this.product.Price = p;
    p = MakePreice(temp + c + t, this.fb);

    this.Report('Tax', t);
    this.Report('Price', p);

    return p;
  }

  private CalculatePricemultiplicativeDiscount(tax: number): number {
    this.Report('Cost', this.product.Price);

    let p = this.product.Price;
    let discountBefore = 0;
    let discountAfter = 0;
    let tem = 0;

    for (let i in this.discountBeforeTaxList) {
      tem = this.CalculateDiscount(this.discountBeforeTaxList[i]);
      this.product.Price -= tem;
      discountBefore += tem;
    }

    let t = this.CalculateTax(tax);
    let c = this.CalculateCost();

    for (let i in this.discountAfterTaxList) {
      tem = this.CalculateDiscount(this.discountAfterTaxList[i]);
      this.product.Price -= tem;
      discountAfter += tem;
    }

    let temp = this.product.Price;
    this.product.Price = p;
    p = MakePreice(temp + c + t, this.fb);

    this.Report('Tax', MakePreice(t, this.fb));
    this.Report(
      'Discount',
      MakePreice(discountAfter + discountBefore, this.fb),
    );
    this.Report('Price', p);

    return p;
  }

  private Report(msg: string, value: number) {
    if (msg !== undefined && value !== undefined && value !== 0)
      this.report[msg] = value;
  }

  CalculatePrice(tax: number, AdtiveDiscount?: Boolean): number {
    this.ClearReport();
    if (AdtiveDiscount === undefined || AdtiveDiscount === true)
      return this.CalculatePriceAdtiveDiscount(tax);
    else return this.CalculatePricemultiplicativeDiscount(tax);
  }

  PrintReport() {
    for (let i in this.report) {
      //if I want to format the otput
      if (i === 'Discount' && this.report[i] === 0) console.log('No discount');
      else console.log(i, '=', this.report[i], this.currancy);
    }
  }

  SaveCSVFile() {
    const fastcsv = require('fast-csv');
    const fs = require('fs');
    const ws = fs.createWriteStream('out.csv');
    try {
      fastcsv.write([this.report], { headers: true }).pipe(ws);
      console.log('CSV file has been saved.');
    } catch {
      console.log('CSV file has not been saved.');
    }
  }

  SaveJsonFile() {
    //npm i -s fast-csv
    let fs = require('fs');
    fs.writeFile('./out.json', this.ToJson(), 'utf8', err => {
      if (err) console.log('JSON file has not been saved.');
      else console.log('JSON file has been saved.');
    });
  }

  private ToJson() {
    return this.DisctionaryToJson('Report', this.report);
  }

  private DisctionaryToJson(name: string, fic: {}) {
    let json = name + '{\n';
    for (let i in fic) {
      json += i + ':' + fic[i] + ',\r\n';
    }
    json += '}\n\r';
    return json;
  }
}
