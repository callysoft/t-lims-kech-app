import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Othercategory} from 'feature/items/other-category/othercategory';
import {Category} from 'core/model/category';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CATEGORY} from 'core/constant/category.const';
import {CodeValue, Contact} from 'core/model/base-model';
import {ItemService} from 'feature/items/item.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {Utils} from 'core/utils/utils';


@Component({
  selector: 'tlims-other-category',
  templateUrl: './other-category.component.html',
  styleUrls: ['./other-category.component.scss']
})
export class OtherCategoryComponent implements OnInit, OnDestroy {

  othercategory: Othercategory;
  @Input()
  subCategories: Array<Category> = [];
  oForm: FormGroup;
  CATEGORY = CATEGORY;
  isLoading = false;
  files: File[];
  contact: Contact = new Contact();
  tagSuggestions = ['KG', 'Bags', 'Kongo', 'Cartons','Derica'];
  num1:number;
  price:number;

  constructor(private fb: FormBuilder, private itemService: ItemService,
              private toastr: ToastrService, private router: Router) {
    itemService.endPoint = 'services';
  }

  ngOnInit() {
    this.price=this.num1 + 2500;
    this.reset();
  }

  getContact($event) {
    this.contact = $event;
  }

  getImages($event) {
    this.files = $event;
  }

  create() {
    this.isLoading = true;
    this.othercategory = this.oForm.value;
    this.othercategory.contact = this.contact;
    this.itemService.create('services', this.othercategory, this.files).pipe(untilDestroyed(this)).subscribe((res) => {
      this.isLoading = false;
      this.toastr.success('Ad ' + this.othercategory.titleDescription.title + ' successfully created');
      this.reset();
      this.router.navigateByUrl(APP_URL.bo.user.ads);
    }, (err) => {
      this.toastr.error('Error creating AD ' + this.othercategory.titleDescription.title);
      this.isLoading = false;
    });
  }

  cancel() {
    console.log(this.oForm.value);
  }

  reset() {
    this.othercategory = new Othercategory();
    this.files = [];
    this.initForm();
  }

  populateCodeValueName(groupName) {
    if ('subCategory' === groupName) {
      this.setNameFromCodeValue(groupName, Utils.getNameFromCategory(this.subCategories, this.getValueFromCodeValue(groupName)));
    }
  }

  getValueFromCodeValue(groupName, isName?: boolean) {
    return isName ? this.oForm.get(groupName).get('name').value : this.oForm.get(groupName).get('code').value;
  }

  setNameFromCodeValue(groupName, value: any) {
    this.oForm.get(groupName).get('name').setValue(value);
  }

  contactForPriceFg(val?) {
    this.setRequiredField('price', true);
    val = val || this.oForm.get('contactForPrice').value;
    if (val) {
      this.setRequiredField('price', false);
      this.oForm.get('price').setValue(null);
    }
  }

  setRequiredField(fieldName: string, isRequired: boolean) {
    const field = this.oForm.get(fieldName);
    if (isRequired) {
      field.setValidators([Validators.required]);
      this.markFields(field);
    } else {
      field.clearValidators();
    }
    field.updateValueAndValidity();
  }

  markFields(control) {
    control.markAsPristine();
    control.markAsUntouched();
  }

  initForm() {
    const subCategory = this.othercategory.subCategory.code ? this.othercategory.subCategory :
      CodeValue.of(this.subCategories[0].categoryCode.dataCode, this.subCategories[0].titleDescription.title);
    this.oForm = this.fb.group({
      titleDescription: this.fb.group({
        title: [this.othercategory.titleDescription.title, [Validators.required]],
        description: [this.othercategory.titleDescription.description]
      }),
      category: this.fb.group({
        code: [this.subCategories[0].parentCategory.categoryCode.dataCode],
        name: [this.subCategories[0].parentCategory.titleDescription.title]
      }),
      subCategory: this.fb.group({
        code: [subCategory.code, [Validators.required]],
        name: [subCategory.name, [Validators.required]]
      }),
      contactForPrice: [this.othercategory.contactForPrice],
      price: [this.othercategory.price],
      measurement: [this.othercategory.measurement],
      negotiable: [this.othercategory.negotiable]
    });
    this.contactForPriceFg();
  }

  ngOnDestroy(): void {
  }

}
