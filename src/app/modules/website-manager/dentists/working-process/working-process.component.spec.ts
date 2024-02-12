import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingProcessComponent } from './working-process.component';

describe('WorkingProcessComponent', () => {
  let component: WorkingProcessComponent;
  let fixture: ComponentFixture<WorkingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
