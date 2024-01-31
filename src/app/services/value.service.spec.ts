
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('ValueService', () => {
  let service: ValueService;
  // Before TestBed
  // beforeEach(()=>{
  //   service = new ValueService();

  // })

  // After TestBed
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService]
    });
    service = TestBed.inject(ValueService);
  });


  it('should be create', () =>{
    expect(service).toBeTruthy();
  });

  describe('Tests for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toEqual('my value');
      service.setValue('new value');
      expect(service.getValue()).toEqual('new value');
    });
  })

  describe(' Test for getPromiseValue', () => {
    it('should return "promise value"', (doneFn) => {
      service.getPromiseValue()
      .then((value)=>{
        expect(value).toEqual('promise value');
        doneFn();
      })})
    });

    it('Should return the same value as the promise', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toEqual('promise value');
      });

    describe('Test for getObservableValue', () => {
      it('should return "observable value"', (doneFn) => {
        service.getObservableValue().subscribe((value) => {
          expect(value).toEqual('observable value');
          doneFn();
        });
      });

      it('should return the same value as the observable', async () => {
        const rta = await service.getObservableValue().toPromise();
        expect(rta).toEqual('observable value');
      });
    });
  })
