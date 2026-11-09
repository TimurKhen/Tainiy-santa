import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nickname } from './nickname';

describe('Nickname', () => {
  let component: Nickname;
  let fixture: ComponentFixture<Nickname>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nickname],
    }).compileComponents();

    fixture = TestBed.createComponent(Nickname);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
