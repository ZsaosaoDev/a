import { TestBed } from '@angular/core/testing';

import { Vsstaff } from './vsstaff';

describe('Vsstaff', () => {
  let service: Vsstaff;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vsstaff);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
