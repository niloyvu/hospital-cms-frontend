import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailServiceProviderComponent } from './mail-service-provider.component';

describe('MailServiceProviderComponent', () => {
  let component: MailServiceProviderComponent;
  let fixture: ComponentFixture<MailServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailServiceProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
