import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CoreService} from 'core/services/core.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Location} from '@angular/common';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ENV} from 'core/config/env.config';
import {MessageService} from 'core/services/message.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe,DatePipe } from '@angular/common';
import { PaymentsService } from '../../../feature/user/services/payments.service';



@Component({
  selector: 'tlims-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  reference = '';
 resultsdisplay: any; 
 sendresult:any;
 paystackAmount: any;
  closeModal: string;
  pipe = new DatePipe('en-US');
  now = Date.now();
  mySimpleFormat = this.pipe.transform(this.now, 'MM/dd/yyyy');
  ad: any;
  dataId: number;
  title: string;
  numberLength = 5;
  btnTitle = 'app.core.shownumber';
  isHide = true;
  isLoading = false;
  isOpenModal = false;
  @BlockUI('view') blockUI: NgBlockUI;
  @BlockUI('profile') blockProfile: NgBlockUI;
  baseUrl = `${ENV.STORAGE_API}`;
  selectedImg: string;
  fullImg = 'https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg';
  slideConfig = {
    'slidesToShow': 1,
    'slidesToScroll': 1,
    'autoplay': false
  };
  readMore = '<a (click)="toggleFullText()" href="javascript:void(0);">[...]</a>';

  constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private coreService: CoreService,
              private location: Location, private payService: PaymentsService,  private messageService: MessageService,private modalService: NgbModal, private decimalPipe: DecimalPipe) {
                
  }

  triggerModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  ngOnInit() {
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.activatedRoute.params.pipe(untilDestroyed(this)).subscribe((req) => {
      this.dataId = req.id;
      this.title = req.title;
      this.getAd();
    });
  }


  

  

  sendMessage($event) {
    this.isLoading = true;
    this.messageService.addMesssage($event).pipe(untilDestroyed(this)).subscribe((res: any) => {
      if (res.id) {
        this.toastr.success('Message successfully sent');
      }
      this.isLoading = false;
    });
  }

  getAd() {
    if (!isNaN(this.dataId)) {
      this.blockUI.start('Loading details');
      this.coreService.getAd(this.dataId).pipe(untilDestroyed(this)).subscribe((data: any) => {
        if (data) {
          this.ad = data;
          this.selectedImg = this.baseUrl + this.ad.images[0];
          
          this.blockUI.stop();
        }
      }, (err) => {
        this.blockUI.stop();
        this.toastr.error('Error loading details of record ' + this.title);
      });
    } else {
      this.toastr.error('Details not found for record ' + this.title);
      this.location.back();
    }
  }

  toggleNumber() {
    this.isHide = !this.isHide;
    if (this.isHide) {
      this.btnTitle = 'app.core.shownumber';
      this.numberLength = 5;
      return;
    }
    this.btnTitle = 'app.core.hidenumber';
    this.numberLength = 12;
  }

  ngOnDestroy(): void {
  }

  getSellingPrice(price, additional:any = 0){
    let parsePrice;
    let parseAdditionalPrice = 0;

    parsePrice = price.split('NGN');
    parsePrice = parsePrice[0];
    parsePrice = parsePrice.replace(',', '');
    parsePrice = parseFloat(parsePrice);
    parseAdditionalPrice = parseFloat(additional);

    this.resultsdisplay = Number(parseFloat(parsePrice + parseAdditionalPrice).toFixed(2)).toLocaleString(
      'en',{
        minimumFractionDigits:2
      }
    );

    return this.resultsdisplay;

    // return result;
  }


  getSellingP(price, additional:any = 0){
    let parsePrice;
    let parseAdditionalPrice = 0;

    parsePrice = price.split('NGN');
    parsePrice = parsePrice[0];
    parsePrice = parsePrice.replace(',', '');
    parsePrice = parseFloat(parsePrice);
    parseAdditionalPrice = parseFloat(additional);

    this.paystackAmount = parseFloat(parsePrice + parseAdditionalPrice)*100;
    this.sendresult = parseFloat(parsePrice + parseAdditionalPrice)-2500;

    return this.paystackAmount;

    // return result;
  }


  

  
  

  paymentInit() {
    console.log('Payment initialized');
  
   
   


  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';
    console.log(this.title, ref);

    const data = {
      vendoremail: this.ad.contact?.email,
      referenceid: this.reference,
      createdat: this.mySimpleFormat,
      vendorprice: this.sendresult,
      amountpaid: this.paystackAmount/100,
      payment_status: 'completed',
      productname: this.ad.titleDescription?.title,
      delivery_status: 'processing'
  
  
    };
  
    this.payService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.toastr.success('Payment Done Successfully');
        },
        error => {
          console.log(error);
          this.toastr.error('Whoop! Something Went Wrong');
        });
  
   
  
   
  }

  paymentCancel() {
    console.log('payment failed');
  }
}


