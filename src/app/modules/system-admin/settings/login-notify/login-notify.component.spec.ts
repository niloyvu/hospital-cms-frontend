import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNotifyComponent } from './login-notify.component';

describe('LoginNotifyComponent', () => {
  let component: LoginNotifyComponent;
  let fixture: ComponentFixture<LoginNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginNotifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
