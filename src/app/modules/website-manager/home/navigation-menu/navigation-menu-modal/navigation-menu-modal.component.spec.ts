import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuModalComponent } from './navigation-menu-modal.component';

describe('NavigationMenuModalComponent', () => {
  let component: NavigationMenuModalComponent;
  let fixture: ComponentFixture<NavigationMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMenuModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
