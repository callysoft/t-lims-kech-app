import { environment } from "./../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CrudService {
  user;
  private baseUrl = environment;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));
  }

  formatEndpoint(endpoint) {
    return endpoint;
  }

  createData(endpoint, data, context?) {
    const url = this.baseUrl[context] + this.formatEndpoint(endpoint);
    return this.http.post<any>(url, data).pipe(
      map(response => {
        return response;
      })
    );
  }

  getData(endpoint: string, context?) {
    let theEndpoint = this.formatEndpoint(endpoint);
    if (context == "usermanagerUrl" || "fileServerUrl") {
      theEndpoint = endpoint;
    }
    const url = this.baseUrl[context] + theEndpoint;
    return this.http.get<any>(url, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

  updateData(endpoint, data, context?) {
    const url = this.baseUrl[context] + this.formatEndpoint(endpoint);
    return this.http.put<any>(url, data).pipe(
      map(response => {
        return response;
      })
    );
  }

  updateStatusData(endpoint: string, context?) {
    const url = this.baseUrl[context] + this.formatEndpoint(endpoint);
    return this.http.put<any>(url, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

  deleteData(endpoint: string, context?) {
    const url = this.baseUrl[context] + this.formatEndpoint(endpoint);
    return this.http.delete<any>(url, {}).pipe(
      map(response => {
        return response;
      })
    );
  }

  deleteDataByPhoneNumber(endpoint: string, data, context?) {
    const url = this.baseUrl[context] + this.formatEndpoint(endpoint);
    return this.http.delete<any>(url, data).pipe(
      map(response => {
        return response;
      })
    );
  }
}