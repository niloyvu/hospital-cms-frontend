import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSectionComponent } from './appointment-section.component';

describe('AppointmentSectionComponent', () => {
  let component: AppointmentSectionComponent;
  let fixture: ComponentFixture<AppointmentSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
