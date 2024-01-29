import { Calculator } from './calculator';


describe('Test For Calculator', () => {
 it('#multiply should return 6', () => {
    const calculator = new Calculator();
    expect(calculator.multiply(2, 3)).toBe(6);
  }
  );

  it('#divide should return 3', () => {
    const calculator = new Calculator();
    expect(calculator.divide(6, 2)).toBe(3);
  }
  );

  it('test matchers',() => {
    let name = 'Esteban';
    let name2;

    expect(name).toBeDefined();
    expect(name2).toBeUndefined();
    expect(1+3==4).toBeTruthy();
    expect(1+3==2).toBeFalsy();

  })
});
