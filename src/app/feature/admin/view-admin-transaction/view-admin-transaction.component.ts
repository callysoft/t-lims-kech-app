import { Component, OnInit,NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_URL } from 'core/constant/tlims.url';
import { Paging } from 'core/model/paging';
import { User } from 'core/model/user';
import { AuthenticationService } from 'core/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from "@angular/forms";
import { PaymentsService } from './../../user/services/payments.service';
import {Customer} from './../../../customer';





@Component({
  selector: 'tlims-view-admin-transaction',
  templateUrl: './view-admin-transaction.component.html',
  styleUrls: ['./view-admin-transaction.component.css']
})
export class ViewAdminTransactionComponent implements OnInit {
  payments: any;
  usertransactions: any;
  getId: any;
  id: number;
  updateForm: FormGroup;
  customer: any;
  allCustomers: Customer[];
  customers: Array<Customer> = [];
  showCustomer: Customer;
  isSelected: boolean = false;
  user: User = this.authService.getCurrentUser();
  vendorID=this.user.email;
  currentPayment = null;
  currentIndex = 2;
  @BlockUI('ad-list') blockUI: NgBlockUI;
  searchTerm: string;
  messages = '';

  query: Paging = new Paging();
  APP_URL = APP_URL;
  constructor(public formBuilder: FormBuilder, private payService: PaymentsService,private ngZone: NgZone, private activatedRoute: ActivatedRoute,private toastr: ToastrService,private authService: AuthenticationService,private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit() {

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
  
    this.retrievePayments();
   
  }

  setCustomerDetails(customer: Customer){
    this.isSelected=!this.isSelected;
    if(this.isSelected){
      this.showCustomer = customer;
 
    }else{
      this.showCustomer = undefined;
    }
  }

   
  retrievePayments(): void {
    this.blockUI.start('Loading Transactions...');
    this.payService.getAll()
      .subscribe(
        data => {
        this.usertransactions = data;
        this.allCustomers=this.usertransactions;
          console.log(data);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error('Error loading Transactions');
      this.blockUI.stop();
          console.log(error);
        });
  }
  
  onUpdate(): any {
    
    this.payService.update(this.showCustomer.id, this.updateForm.value)
    .subscribe(() => {
        console.log('Data updated successfully!');
        this.toastr.success('Data updated successfully!');
        window.location.reload();
      }, (err) => {
        console.log(err);
    });
}




  trackByFn(d, index) {
    return d.id;
  }

  ngOnDestroy(): void {
  }


  search(value: string): void {
    this.usertransactions = this.allCustomers.filter((val) => val.productname.toLowerCase().includes(value.toLocaleLowerCase()) ||
    val.referenceid.toLowerCase().includes(value.toLocaleLowerCase()) ||
    val.delivery_status.toLowerCase().includes(value.toLocaleLowerCase())||
     val.payment_status.toLowerCase().includes(value.toLocaleLowerCase()) ||
    val.vendorprice.toString().toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

  updateTransactions(id: number){
    this.router.navigate(['/tlims/bo/admin/products', id]);

  }

  goToList(){
    this.router.navigate(['/tlims/bo/admin/adminpay']);
  }
  

}
