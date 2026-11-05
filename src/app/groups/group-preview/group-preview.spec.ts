import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupPreview } from './group-preview';

describe('GroupPreview', () => {
  let component: GroupPreview;
  let fixture: ComponentFixture<GroupPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
