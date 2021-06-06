import { Component, OnInit,NgZone } from '@angular/core';
import { Customer } from 'app/customer';
import {ToastrService} from 'ngx-toastr';
import { PaymentsService } from '../feature/user/services/payments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { data } from 'jquery';

@Component({
  selector: 'tlims-update-transactions',
  templateUrl: './update-transactions.component.html',
  styleUrls: ['./update-transactions.component.css']
})
export class UpdateTransactionsComponent implements OnInit {
  getId: any;
  id: any;
  updateForm: FormGroup;
  customer: any;
  customers: Array<Customer> = [];
  showCustomer: Customer;
  isSelected: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private payService: PaymentsService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.payService.getProductsById(this.getId).subscribe(res => {
      this.updateForm.setValue({
        id: res['id'],
        referenceid: res['refernceid'],
        productname: res['productname'],
        amountpaid:res['amountpaid'],
        vendorprice:res['vendorprice'],
        createdat: res['createdat'],
        payment_status:res['payment_status'],
        delivery_status:res['delivery_status']
      });
    });
  
    this.updateForm = this.formBuilder.group({
    


        id:[''],
        referenceid:[''],
        productname:[''],
        amountpaid:[''],
        vendorprice:[''],
        createdat:[''],
        payment_status:[''],
        delivery_status:['']
    })

    
  
  }


    ngOnInit(): void {
     
    
}




onUpdate(): any {
  this.payService.update(this.getId, this.updateForm.value)
  .subscribe(() => {
      console.log('Data updated successfully!')
      this.ngZone.run(() => this.router.navigateByUrl('/tlims/bo/admin/adminpay'))
    }, (err) => {
      console.log(err);
  });
}



}