import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TgEmoji } from './tg-emoji';

describe('TgEmoji', () => {
  let component: TgEmoji;
  let fixture: ComponentFixture<TgEmoji>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TgEmoji],
    }).compileComponents();

    fixture = TestBed.createComponent(TgEmoji);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
