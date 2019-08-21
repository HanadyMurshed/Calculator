import { Product, Currancy } from '../src/utils';
import { Order } from '../src/calcuator';

describe('Cap Logic', () => {
  // Assert greeter result
  //case 1
  it('Tax = 20% Tax = 20%, no discount', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 20.25;
    p.UPS = '12345';
    let c = new Order(p);
    c.SetCurrancy(Currancy.dollar);
    let final = c.CalculatePrice(0.2);
    expect(final).toBe(24.3); // there is some error on the tests cases
  });
  //case 2

  it('Tax = 20%, JPY Tax = 20%, no discount', () => {
    let p = new Product();
    p.Name = 'foo';
    p.Price = 17.76;
    p.UPS = '12345';
    let c = new Order(p);
    c.SetCurrancy(Currancy.yen);
    let final = c.CalculatePrice(0.2);
    expect(final).toBe(21.31); // there is some error on the tests cases
  });
});
