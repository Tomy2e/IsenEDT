import { TestBed } from '@angular/core/testing';

import { AurionService } from './aurion.service';

describe('AurionService', () => {
  let service: AurionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AurionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
