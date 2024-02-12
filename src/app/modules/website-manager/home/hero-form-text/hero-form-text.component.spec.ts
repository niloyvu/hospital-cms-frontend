import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormTextComponent } from './hero-form-text.component';

describe('HeroFormTextComponent', () => {
  let component: HeroFormTextComponent;
  let fixture: ComponentFixture<HeroFormTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroFormTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroFormTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
