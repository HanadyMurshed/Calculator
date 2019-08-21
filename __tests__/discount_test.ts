import { Product , discount_type} from '../src/utils';

import { Order } from '../src/calcuator';

describe('Discount Logic', () => {
  // Assert greeter result
  it('Tax=20%, discount=15%\nTax amount = $4.05; Discount amount = $3.04\nPrice before = $20.25, price after = $21.26', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '1234';

    let c = new Order(p);
    c.AddDiscount({
      Amount: 0.15,
      Description: discount_type.UNERVERSAL,
      AfterTax: true,
    });
    expect(c.CalculatePrice(0.2)).toBe(21.26);
  });
});
