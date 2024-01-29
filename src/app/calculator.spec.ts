import { Calculator } from './calculator';


describe('Test For Calculator', () => {
 it('#multiply should return 6', () => {
    const calculator = new Calculator();
    expect(calculator.multiply(2, 3)).toBe(6);
  }
  );
});
