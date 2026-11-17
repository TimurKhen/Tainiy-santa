import { TestBed } from '@angular/core/testing';
import { FileSend } from './file-send';

describe('FileSend', () => {
  let service: FileSend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
