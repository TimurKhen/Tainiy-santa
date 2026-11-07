import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiftBudget } from './gift-budget';

describe('GiftBudget', () => {
  let component: GiftBudget;
  let fixture: ComponentFixture<GiftBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftBudget],
    }).compileComponents();

    fixture = TestBed.createComponent(GiftBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
