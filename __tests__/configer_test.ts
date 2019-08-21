import {
  Product,
  discount_type,
  IUPSDiscount,
  Currancy,
  Cost,
} from '../src/utils';

import { Order } from '../src/calcuator';

describe('Presision Logic', () => {
  // Assert greeter result
  it(
    'Sample product: Title = “The Little Prince”, UPC=12345, price=20.25 USD.  ' +
      'Tax = 21%, universal discount = 15%, UPC discount = 7% for UPC=12345, discounts are multiplicative and after tax ' +
      'Transport cost = 3% of base price',
    () => {
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

      let total = c.CalculatePrice(0.21, false);

      expect(total).toBe(20.87);
    },
  );
});
