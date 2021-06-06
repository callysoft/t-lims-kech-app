import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminTransactionComponent } from './view-admin-transaction.component';

describe('ViewAdminTransactionComponent', () => {
  let component: ViewAdminTransactionComponent;
  let fixture: ComponentFixture<ViewAdminTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdminTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdminTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
