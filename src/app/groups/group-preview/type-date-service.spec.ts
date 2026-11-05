import { TestBed } from '@angular/core/testing';
import { TypeDateService } from './type-date-service';

describe('TypeDateService', () => {
  let service: TypeDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
