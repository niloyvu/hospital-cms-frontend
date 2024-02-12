import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuShiftManageComponent } from './menu-shift-manage.component';

describe('MenuShiftManageComponent', () => {
  let component: MenuShiftManageComponent;
  let fixture: ComponentFixture<MenuShiftManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuShiftManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuShiftManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
