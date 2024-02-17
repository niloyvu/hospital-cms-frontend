import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemFormModalComponent } from './invoice-item-form-modal.component';

describe('InvoiceItemFormModalComponent', () => {
  let component: InvoiceItemFormModalComponent;
  let fixture: ComponentFixture<InvoiceItemFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceItemFormModalComponent]
    });
    fixture = TestBed.createComponent(InvoiceItemFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
