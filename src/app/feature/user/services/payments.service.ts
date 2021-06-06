import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {User} from 'core/model/user';
import {AuthenticationService} from 'core/services/auth.service';
import { Observable} from 'rxjs';
import { Customer } from 'app/customer';


const localbaseUrl = 'https://apisessionapp.herokuapp.com/api/products';
const localbaseUrl2 = 'https://apisessionapp.herokuapp.com/api/products/getall';



@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  user: User = this.authService.getCurrentUser();
  usersemail=this.user.email;
  constructor(private http: HttpClient,private authService: AuthenticationService) { }
  getAll(): Observable<any> {
    return this.http.get(localbaseUrl2);
  }


  getProductsById(usersemail): Observable<any>{
 return this.http.get(`${localbaseUrl}?vendoremail=${usersemail}`);

  }

  create(data): Observable<any> {
    return this.http.post(localbaseUrl, data);
  }

  update(id, data): Observable<any> {
   return this.http.put(`${localbaseUrl}/${id}`, data);
  }

 

  delete(id): Observable<any> {
    return this.http.delete(`${localbaseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(localbaseUrl);
  }

  getByVendorID(vendoremail): Observable<any> {
    return this.http.get(`${localbaseUrl}?vendoremail=${vendoremail}`);
    
  }
}


