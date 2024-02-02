import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { mapsResolver } from './maps.resolver';

describe('mapsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => mapsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
