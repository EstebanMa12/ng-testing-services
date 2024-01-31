import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { FakeValueService } from './value-fake.service';

describe('MasterService', () => {

  let masterService : MasterService;
  let valueServiceSpy : jasmine.SpyObj<ValueService>;

  // After TestBed
  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [MasterService,
        // Cuando se crea un spy se crea un objeto que tiene las mismas propiedades que el objeto que se esta espiando, pero con valores por defecto.
        // Cuando el vea esa dependencia y la tenga que inyectar, va a inyectar el objeto que se creo con el spy.y no el objeto real.
        { provide: ValueService, useValue: spy}]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });
  // BEFORE WE USE TESTBED we need to create the service manually and inject the dependencies, with TestBed we can do it automatically like yo can see above.
  // it('should return "my value" from the real service' , () => {
  //   const valueService = new ValueService();
  //   const masterService  = new MasterService(valueService);

  //   expect(masterService.getValue()).toBe('my value');
  // });

  // it('should return "other value" from the fake service' , () => {
  //   const fakeValueService = new FakeValueService();
  //   const masterService  = new MasterService(fakeValueService as unknown as ValueService);

  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // it('should return "other value" from fake object', () =>{
  //   const fake = { getValue: () => 'fake from obj' };
  //   const masterService = new MasterService(fake as ValueService);

  //   expect(masterService.getValue()).toBe('fake from obj');
  // });

  // tESTING WITH SPY
  it('should call to getValue from valueService', ()=>{
    // const ValueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');

    // const masterService = new MasterService(ValueServiceSpy);
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue.calls.count()).toBe(1);
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);

  })
});
