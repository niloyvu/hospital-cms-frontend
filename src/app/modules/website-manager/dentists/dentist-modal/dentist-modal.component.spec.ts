import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentistModalComponent } from './dentist-modal.component';

describe('DentistModalComponent', () => {
  let component: DentistModalComponent;
  let fixture: ComponentFixture<DentistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
