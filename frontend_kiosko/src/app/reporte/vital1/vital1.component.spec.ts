import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vital1Component } from './vital1.component';

describe('Vital1Component', () => {
  let component: Vital1Component;
  let fixture: ComponentFixture<Vital1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vital1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vital1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
