import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsHeader } from './groups-header';

describe('GroupsHeader', () => {
  let component: GroupsHeader;
  let fixture: ComponentFixture<GroupsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
