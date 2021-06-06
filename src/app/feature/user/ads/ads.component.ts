import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {SearchRequest} from 'core/model/search-request';
import {UserService} from '../user.service';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit, OnDestroy {

  ads: Array<any> = [];
  @BlockUI('ad-list') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  APP_URL = APP_URL;

  constructor(private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUserAds();
  }

  getSellingPrice(price, additional:any = 0){
    let parsePrice;
    let parseAdditionalPrice = 0;

    parsePrice = price.split('NGN');
    parsePrice = parsePrice[0];
    parsePrice = parsePrice.replace(',', '');
    parsePrice = parseFloat(parsePrice);
    parseAdditionalPrice = parseFloat(additional);

    let result = parsePrice + parseAdditionalPrice;
    return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // return result;
  }

  getAllUserAds() {
    this.blockUI.start('Loading ads...');
    this.userService.findUserAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading ads');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
