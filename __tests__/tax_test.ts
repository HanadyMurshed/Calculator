import { Product } from '../src/utils';

import { Order } from '../src/calcuator';

describe('Tax Logic', () => {
  // Assert greeter result
  it('Product price reported as $20.25 before tax and $24.30 after 20% tax.', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '1234';
    let c = new Order(p);

    expect(c.CalculatePrice(0.2)).toBe(24.3);
  });
  it('Product price reported as $20.25 before tax and $24.30 after 21% tax.', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '1234';

    let c = new Order(p);
    expect(c.CalculatePrice(0.21)).toBe(24.5);
  });
});
