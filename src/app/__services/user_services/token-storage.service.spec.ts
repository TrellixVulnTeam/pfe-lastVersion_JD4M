import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from '../__services/ token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});