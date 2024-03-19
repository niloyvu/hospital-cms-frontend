import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormModalComponent } from './invoice-form-modal.component';

describe('InvoiceFormModalComponent', () => {
  let component: InvoiceFormModalComponent;
  let fixture: ComponentFixture<InvoiceFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceFormModalComponent]
    });
    fixture = TestBed.createComponent(InvoiceFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
