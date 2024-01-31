
import { MasterService } from './master.service';
import { ValueService } from './value.service';

describe('MasterService', () => {

  it('should return "my value" from the real service' , () => {
    const valueService = new ValueService();
    const masterService  = new MasterService(valueService);

    expect(masterService.getValue()).toBe('my value');

  });
});
