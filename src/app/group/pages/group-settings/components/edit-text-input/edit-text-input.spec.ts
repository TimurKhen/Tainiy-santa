import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTextInput } from './edit-text-input';

describe('EditTextInput', () => {
  let component: EditTextInput;
  let fixture: ComponentFixture<EditTextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTextInput],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTextInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
