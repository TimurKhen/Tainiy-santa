import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupPlaceholder } from './group-placeholder';

describe('GroupPlaceholder', () => {
  let component: GroupPlaceholder;
  let fixture: ComponentFixture<GroupPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPlaceholder],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPlaceholder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
