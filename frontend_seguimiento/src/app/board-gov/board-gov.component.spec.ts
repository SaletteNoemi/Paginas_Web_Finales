import { ComponentFixture, TestBed } from '@angular/core/testing';


import { BoardGovComponent } from './board-gov.component';

describe('BoardGovComponent', () => {
  let component: BoardGovComponent;
  let fixture: ComponentFixture<BoardGovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardGovComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardGovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
