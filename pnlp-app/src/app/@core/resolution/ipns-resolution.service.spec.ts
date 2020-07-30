import { TestBed } from '@angular/core/testing';

import { IpnsResolutionService } from './ipns-resolution.service';

describe('IpnsResolutionService', () => {
  let service: IpnsResolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpnsResolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
