import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import { PaymentsService } from '../services/payments.service';
import {AuthenticationService} from 'core/services/auth.service';
import {APP_URL} from 'core/constant/tlims.url';
import {User} from 'core/model/user';
import {Message, MessageSource} from 'core/model/message';
import {FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'app/customer';



@Component({
  selector: 'tlims-userpayment',
  templateUrl: './userpayment.component.html',
  styleUrls: ['./userpayment.component.css']
})
export class UserpaymentComponent implements OnInit {
  message: Message = new Message();
  payments: any;
  usertransactions: any;
  user: User = this.authService.getCurrentUser();
  vendorID=this.user.email;
  currentPayment = null;
  currentIndex = -1;
  @BlockUI('ad-list') blockUI: NgBlockUI;

  searchTerm: string;
  customers: Customer[];
  allCustomers: Customer[];
  
  query: Paging = new Paging();
  searchField: FormControl;
  APP_URL = APP_URL;
  constructor( private payService: PaymentsService,private toastr: ToastrService,private authService: AuthenticationService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    

    

  this.getByVendorEmail(this.vendorID)


}
  



 
  getByVendorEmail(vendoremail): void {
    this.blockUI.start('Loading Transactions...');
  
    this.payService.getProductsById(vendoremail)
      .subscribe(
        data => {
          this.usertransactions = data;
          this.allCustomers=this.usertransactions;
          console.log(data);
        },
        error => {
          this.toastr.error('Error loading Transactions');
      this.blockUI.stop();
          console.log(error);
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
  

}
