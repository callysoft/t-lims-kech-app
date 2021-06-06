import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Message, MessageSource} from 'core/model/message';
import {MsgService} from 'core/services/msg.service';
import { CrudService } from "../../../services/crud.service";
import {AuthenticationService} from 'core/services/auth.service';
import {User} from 'core/model/user';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from "@angular/common/http";





@Component({
  selector: 'tlims-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
  
})
export class MessageFormComponent implements OnInit, OnChanges {  
  
  mForm: FormGroup;
  message: Message = new Message();
  @Output()
  messageOutput = new EventEmitter<Message>();
  @Input()
  isLoading = false;
  @Input()
  title = true;
  @Input()
  recipient: string;
  @Input()
  postId: number;
  disableBtn = false;
  @Output()
  close = new EventEmitter();
  @Input()
  dismissAble = false;
  @Input()
  visible = false;


  email : string;
  name : string;
  messages : string;
  phoneNumber: number;
  subject: string;
  header: string;
  
  isSuccess = false;
  endpoint = "/salesEmail"; 

  
  

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private toastr: ToastrService, private http: HttpClient,private crudService: CrudService, private readonly toastrs: MsgService) {
    
  }

  ngOnInit() {
    
    this.mForm = this.fb.group({
      recipient: [null],
      subject:[null],
      phoneNumber:[null],
      email:[null],
      name:[null],
      content:[null]
    });
  }

  get formData() {
    return this.mForm.controls;
  }

  onSubmit() {
    const data = {
      recipient: "brainardskills@gmail.com",
      subject: "Sales Equiry",
      name: this.formData.name.value,
      phoneNumber: this.formData.phoneNumber.value,
      email: this.formData.email.value,
      content:this.formData.content.value
    };
    this.createData(data);
  }

  createData(data){
    this.showSuccess();
    this.ngOnInit();
    console.log(data);
    this.crudService.createData(this.endpoint, data, "salesUrl").subscribe(
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
    this.toastrs.success('Message Sent Successfully');
  }
showError() {
    this.toastrs.error('Whoop!!! Something went wrong');
  }


  closeModal() {
    this.visible = false;
    this.close.emit(this.visible);
  }

  

  onDismiss() {
    if (this.dismissAble) {
      this.visible = !this.visible;
      this.close.emit(this.visible);
    }
  }

  dismiss() {
    if (this.dismissAble) {
      this.visible = false;
      this.close.emit(this.visible);
    }
  }

  
 
  validate() {
    this.disableBtn = false;
    const email = this.mForm.get('contact').get('email').value;
    if (email) {
      if (this.recipient === email) {
        this.toastr.warning('Email cannot be sent to self');
        this.disableBtn = true;
      }
    }
  }

  setDefaults() {
    if (this.authService.isLoggedIn()) {
      const user: User = this.authService.getCurrentUser();
      this.message.contact.name = user.displayName;
      this.message.contact.email = user.email;
      this.message.contact.phoneNumber = user.phoneNumber;
    } else {
      this.message.source = MessageSource.EXTERNAL;
    }
    this.message.recipient = 'brainardskills@gmail.com';
    this.message.postId = this.postId;
  }

  reset() {
    this.message = new Message();
    this.setDefaults();
    this.initForm();
    
  }


 

  

  private initForm() {
    this.mForm = this.fb.group({
      contact: this.fb.group({
        name: [this.message.contact.name],
        phoneNumber: [this.message.contact.phoneNumber],
        email: [this.message.contact.email]
      }),
      content: [this.message.content],
      postId: [this.message.postId],
      recipient: [this.recipient]
    });
    this.validate();
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading) {
      if (!changes.isLoading.currentValue) {
        this.reset();
      }
    }
  }
}
function mail(recipient: string, subject: string, messages: string, header: string) {
  throw new Error('Function not implemented.');
}

