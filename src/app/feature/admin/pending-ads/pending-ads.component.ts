import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from 'feature/admin/admin.service';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Ad} from 'feature/items/ad';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {TLIMS_CONST} from 'core/constant/tlims.const';

@Component({
  selector: 'tlims-pending-ads',
  templateUrl: './pending-ads.component.html',
  styleUrls: ['./pending-ads.component.scss']
})
export class PendingAdsComponent implements OnInit, OnDestroy {

  ads: Array<Ad> = [];
  singleAd: Ad = new Ad();
  isLoading = false;
  searchTerm = '';
  query: Paging = new Paging();
  searchField: FormControl = new FormControl();
  isModal = false;
  reason: FormControl = new FormControl();
  isReject = false;
  changeContact = false;
  cForm: FormGroup;
  isDataLoading = false;

  constructor(private adminService: AdminService, private toastr: ToastrService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
    this.reason.setValidators([Validators.required]);
    this.searchField.valueChanges.pipe(debounceTime(400), distinctUntilChanged(),
      switchMap((value) => of(value)), untilDestroyed(this)).subscribe((res) => {
      this.searchTerm = res;
      this.getAllPendingAds();
    });
    this.getAllPendingAds();
  }

  initForm() {
    this.cForm = this.fb.group({
      primaryContact: this.fb.group({
        name: [this.singleAd.primaryContact.name, [Validators.required]],
        phoneNumber: [this.singleAd.primaryContact.phoneNumber, [Validators.required]],
        email: [this.singleAd.primaryContact.email, [Validators.required]]
      })
    });
  }

  onApprove(ad: Ad) {
    this.singleAd = ad;
    this.initForm();
    this.isModal = true;
  }

  approveAd() {
    this.isLoading = true;
    this.singleAd.primaryContact = this.cForm.get('primaryContact').value;
    this.adminService.approveAd(this.singleAd).pipe(untilDestroyed(this)).subscribe((data) => {
      if (data === TLIMS_CONST.REQUEST_SUCCESS) {
        this.toastr.success(this.singleAd.titleDescription.title + ' successfully approved');
        this.cancel();
        this.isLoading = false;
        this.getAllPendingAds();
      }
    }, (err) => {
      this.isLoading = false;
      this.toastr.error('Error approving Ad ' + this.singleAd.titleDescription.title);
    });
  }

  onReject(d) {
    this.singleAd = d;
    this.isReject = true;
    this.isModal = true;
  }

  rejectAd() {
    this.isLoading = true;
    this.singleAd.rejectionReason = this.reason.value;
    this.adminService.rejectAd(this.singleAd).pipe(untilDestroyed(this)).subscribe((data) => {
      if (data === TLIMS_CONST.REQUEST_SUCCESS) {
        this.toastr.success(this.singleAd.titleDescription.title + ' successfully rejected');
        this.cancel();
        this.isLoading = false;
        this.getAllPendingAds();
      }
    }, (err) => {
      this.isLoading = false;
      this.toastr.error('Error rejecting Ad ' + this.singleAd.titleDescription.title);
    });
  }

  cancel() {
    this.isReject = false;
    this.isModal = false;
    this.isLoading = false;
    if (this.reason.valid) {
      this.reason = new FormControl();
    }
    this.singleAd = new Ad();
    this.initForm();
  }

  getAllPendingAds() {
    this.isDataLoading = true;
    this.adminService.pendingAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.isDataLoading = false;
    }, (err) => {
      this.toastr.error('Error loading pending ads');
      this.isDataLoading = false;
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
