import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeOrderModalComponent } from './make-order-modal.component';

describe('MakeOrderModalComponent', () => {
  let component: MakeOrderModalComponent;
  let fixture: ComponentFixture<MakeOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeOrderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
