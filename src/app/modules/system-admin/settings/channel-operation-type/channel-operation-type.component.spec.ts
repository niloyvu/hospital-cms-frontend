import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelOperationTypeComponent } from './channel-operation-type.component';

describe('ChannelOperationTypeComponent', () => {
  let component: ChannelOperationTypeComponent;
  let fixture: ComponentFixture<ChannelOperationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelOperationTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
