import { Product, Cost, IUPSDiscount, discount_type } from '../src/utils';

import { Order } from '../src/calcuator';

//EXPENSES
describe('Expenses Logic', () => {
  // Assert greeter result
  it(
    'Tax 21%, discount = 15%, UPC discount = 7% for UPC=12345 ' +
      'Packaging cost = 1% of price  ' +
      'Transport cost = $2.2  ' +
      'Tax amount = $20.25 _ 21% = $4.25, discounts = $20.25 _ 15% + $20.25 * 7% = $3.04 + $1.42 = $4.46  ' +
      'Packaging = $20.25 * 1% = $0.20, transport = $2.2',
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

      c.AddCost(new Cost('Packaging', '%1'));
      c.AddCost(new Cost('transport', '$2.2'));

      let total = c.CalculatePrice(0.21);
      expect(total).toBe(22.44);
    },
  );
});
