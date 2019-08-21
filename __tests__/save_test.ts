import {
  Product,
  discount_type,
  IUPSDiscount,
  Currancy,
  Cost,
} from '../src/utils';

import { Order } from '../src/calcuator';

let p = new Product();
p.Name = 'foo';
p.Price = 20.25;
p.UPS = '12345';

let c = new Order(p);
c.AddDiscount({
  Amount: 0.15,
  Description: discount_type.UNERVERSAL,
  AfterTax: true,
});
c.AddDiscount({
  Amount: 0.07,
  Description: discount_type.UPS,
  AfterTax: true,
  Code: '12345',
} as IUPSDiscount);

c.SetCurrancy(Currancy.dollar);
c.SetPresision(4);
c.AddCost(new Cost('Transport', '%3'));
c.CalculatePrice(0.21, false);


c.SaveCSVFile();
