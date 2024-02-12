import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetterSectionComponent } from './news-letter-section.component';

describe('NewsLetterSectionComponent', () => {
  let component: NewsLetterSectionComponent;
  let fixture: ComponentFixture<NewsLetterSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsLetterSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsLetterSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
