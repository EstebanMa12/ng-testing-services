
import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { FakeValueService } from './value-fake.service';

describe('MasterService', () => {

  it('should return "my value" from the real service' , () => {
    const valueService = new ValueService();
    const masterService  = new MasterService(valueService);

    expect(masterService.getValue()).toBe('my value');
  });

  it('should return "other value" from the fake service' , () => {
    const fakeValueService = new FakeValueService();
    const masterService  = new MasterService(fakeValueService as unknown as ValueService);

    expect(masterService.getValue()).toBe('fake value');
  });

  it('should return "other value" from fake object', () =>{
    const fake = { getValue: () => 'fake from obj' };
    const masterService = new MasterService(fake as ValueService);

    expect(masterService.getValue()).toBe('fake from obj');
  });

  // tESTING WITH SPY
  it('should call to getValue from valueService', ()=>{
    const ValueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    ValueServiceSpy.getValue.and.returnValue('fake value');

    const masterService = new MasterService(ValueServiceSpy);
    expect(masterService.getValue()).toBe('fake value');
    expect(ValueServiceSpy.getValue.calls.count()).toBe(1);
    expect(ValueServiceSpy.getValue).toHaveBeenCalled();
    expect(ValueServiceSpy.getValue).toHaveBeenCalledTimes(1);

  })
});
