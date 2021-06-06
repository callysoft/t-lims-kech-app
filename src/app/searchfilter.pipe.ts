import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from './customer';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(Customers: Customer[], searchValue:string): Customer[] {
    if(! Customers || ! searchValue){
      return Customers;
    }
    return Customers.filter(Customer=>Customer.productname.toLocaleLowerCase()
    .includes(searchValue.toLocaleLowerCase()));
  }

}
