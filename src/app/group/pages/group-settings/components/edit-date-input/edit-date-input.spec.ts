import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDateInput } from './edit-date-input';

describe('EditDateInput', () => {
  let component: EditDateInput;
  let fixture: ComponentFixture<EditDateInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDateInput],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDateInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
