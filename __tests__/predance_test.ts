import { Product, IUPSDiscount, discount_type } from '../src/utils';

import { Order } from '../src/calcuator';

//PRECEDENCE test
describe('Predence Logic', () => {
  // Assert greeter result
  it('Sample product: Title = “The Little Prince”, UPC=12345, price=$20.25 \n Tax = 20%, universal discount (after tax) = 15%, UPC-discount (before tax) = 7% for UPC=12345', () => {
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
      AfterTax: false,
      Code: '12345',
    } as IUPSDiscount);

    expect(c.CalculatePrice(0.2)).toBe(19.78);
  });
});
