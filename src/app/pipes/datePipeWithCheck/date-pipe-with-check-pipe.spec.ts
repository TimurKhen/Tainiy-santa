import { DatePipeWithCheckPipe } from './date-pipe-with-check-pipe';

describe('DatePipeWithCheckPipe', () => {
  it('create an instance', () => {
    const pipe = new DatePipeWithCheckPipe();
    expect(pipe).toBeTruthy();
  });
});
