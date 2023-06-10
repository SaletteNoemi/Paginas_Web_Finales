import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPharmacyComponent } from './board-pharmacy.component';

describe('BoardPharmacyComponent', () => {
  let component: BoardPharmacyComponent;
  let fixture: ComponentFixture<BoardPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardPharmacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
