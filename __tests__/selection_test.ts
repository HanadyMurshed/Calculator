import { Product } from '../src/utils';

import { IUPSDiscount ,discount_type} from '../src/utils';

import { Order } from '../src/calcuator';

// selection est

describe('Selection Logic', () => {
  // Assert greeter result
  it('Tax = 20%, universal discount = 15%, UPC-discount = 7% for UPC=12345  \nTaxx amount = $20.25 * 20% = $4.05, discount = $20.25 * 15% = $3.04, UPC discount = $1.42 ', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '12345';

    let c = new Order(p);
    c.AddDiscount({
      Amount: 0.07,
      Description: discount_type.UPS,
      Code: '12345',
      AfterTax: true,
    } as IUPSDiscount);
    c.AddDiscount({
      Amount: 0.15,
      Description: discount_type.UNERVERSAL,
      AfterTax: true,
    });
    expect(c.CalculatePrice(0.2)).toBe(19.84);
  });

  it('Tax = 20%, universal discount = 15%, UPC-discount = 7% for UPC=789  \nTaxx amount = $20.25 * 20% = $4.05, discount = $20.25 * 15% = $3.04, UPC discount = $1.42 ', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '12345';

    let c = new Order(p);

    c.AddDiscount({
      Amount: 0.07,
      Description: discount_type.UPS,
      Code: '789',
    } as IUPSDiscount);
    c.AddDiscount({
      Amount: 0.15,
      Description: discount_type.UNERVERSAL,
      AfterTax: true,
    });
    expect(c.CalculatePrice(0.21)).toBe(21.46);
  });
});
