import { Product, IUPSDiscount, discount_type } from '../src/utils';

import { Order } from '../src/calcuator';

describe('Cap Logic', () => {
  // Assert greeter result
  //case 1
  it(
    'Tax = 21%, discount = 15%, UPC discount = 7% for UPC=12345, additive discounts, cap = 20%  ' +
      'Tax amount = $20.25 * 21% = $4.25, discounts = $20.25 * 15% + $20.25 _ 7% = $3.04 + $1.42 = $4.46, cap = $20.25 _ 20% = $4.05',
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

      c.SetDiscountLimit('%20');
      let final = c.CalculatePrice(0.21);
      expect(final).toBe(20.45);
    },
  );

  //case 2
  it('Tax = 21%, discount = 15%, UPC discount = 7% for UPC=12345, additive discounts, cap = $4\nTax amount = $20.25 _ 21% = $4.25, discounts = $20.25 _ 15% + $20.25 * 7% = $3.04 + $1.42 = $4.46, cap = $4', () => {
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

    c.SetDiscountLimit('$4');
    let final = c.CalculatePrice(0.21);

    expect(final).toBe(20.5);
  });

  //case 3
  it(
    'Tax = 21%, discount = 15%, UPC discount = 7% for UPC=12345, additive discounts, cap = 30% ' +
      'Tax amount = $20.25 * 21% = $4.25, discounts = $20.25 * 15% + $20.25 _ 7% = $3.04 + $1.42 = $4.46, cap = $20.25 _ 30% = $6.08',
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

      c.SetDiscountLimit('%30');
      let final = c.CalculatePrice(0.21);
      expect(final).toBe(20.04);
    },
  );
});
