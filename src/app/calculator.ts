export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
  multiply(a: number, b: number): number {
    return a * b;
  }
  divide(a: number, b: number) {
    if (b === 0) {
      return null;
    }
    return a / b;
  }
}
