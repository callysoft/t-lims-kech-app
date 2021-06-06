import { Component, OnInit, Injectable } from '@angular/core';
import {MsgService} from 'core/services/msg.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CrudService } from "../../../services/crud.service";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: 'tlims-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']

})
export class ContactComponent implements OnInit{
  form: FormGroup;
  isSuccess = false;
  endpoint = "/sendEmail"; 
  
  constructor(private fb: FormBuilder, private crudService: CrudService, private readonly toastr: MsgService) { 
    
  }
  
  ngOnInit() {
    
    this.form = this.fb.group({
      receiverEmail: [null],
      subject:[null],
      names:[null],
      phoneNumber:[null],
      senderEmail:[null],
      message:[null]
    });
  }

  get formData() {
    return this.form.controls;
  }

  onSubmit() {
    const data = {
      receiverEmail: "customerservice@tlims-kech.com",
      subject: "Contact Form",
      names: this.formData.names.value,
      phoneNumber: this.formData.phoneNumber.value,
      senderEmail: this.formData.senderEmail.value,
      message:this.formData.message.value
    };
    this.createData(data);
  }

  createData(data){
    this.showSuccess();
    this.ngOnInit();
    console.log(data);
    this.crudService.createData(this.endpoint, data, "emailUrl").subscribe(
      data => {
        console.log(data);
        location.reload();
      
      
        

      },
      error => {
        console.error(error);
        this.showError();
        this.ngOnInit()
      }
    );
  }

  showSuccess() {
    this.toastr.success('Message Sent Successfully');
  }
showError() {
    this.toastr.error('Whoop!!! Something went wrong');
  }

}
