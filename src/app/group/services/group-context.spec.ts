import { TestBed } from '@angular/core/testing';
import { GroupContext } from './group-context';

describe('GroupContext', () => {
  let service: GroupContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
