import { TestBed } from '@angular/core/testing';

import { EntService } from './ent.service';

describe('EntService', () => {
  let service: EntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
