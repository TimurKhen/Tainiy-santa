import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupOverview } from './group-overview';

describe('GroupOverview', () => {
  let component: GroupOverview;
  let fixture: ComponentFixture<GroupOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
