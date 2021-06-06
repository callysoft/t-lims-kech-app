import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionsComponent } from './update-transactions.component';

describe('UpdateTransactionsComponent', () => {
  let component: UpdateTransactionsComponent;
  let fixture: ComponentFixture<UpdateTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
