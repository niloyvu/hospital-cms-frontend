import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenseModalComponent } from './income-expense-modal.component';

describe('IncomeExpenseModalComponent', () => {
  let component: IncomeExpenseModalComponent;
  let fixture: ComponentFixture<IncomeExpenseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeExpenseModalComponent]
    });
    fixture = TestBed.createComponent(IncomeExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
