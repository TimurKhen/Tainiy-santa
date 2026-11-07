import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconSelect } from './icon-select';

describe('IconSelect', () => {
  let component: IconSelect;
  let fixture: ComponentFixture<IconSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
