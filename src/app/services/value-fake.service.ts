
export class FakeValueService {


  constructor() { }

  getValue() {
    return 'fake value';
  }

  setValue(value: string) {
    // do nothing
  }

  getPromiseValue() {
    return Promise.resolve('fake promise value');
  }

}
