import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSubscriptionsComponent } from './web-subscriptions.component';

describe('WebSubscriptionsComponent', () => {
  let component: WebSubscriptionsComponent;
  let fixture: ComponentFixture<WebSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSubscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
