import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentistDetailsComponent } from './dentist-details.component';

describe('DentistDetailsComponent', () => {
  let component: DentistDetailsComponent;
  let fixture: ComponentFixture<DentistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentistDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
