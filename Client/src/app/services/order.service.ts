import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = '/orders';

  constructor() { }
  createOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/newOrder`, order);
  }
}
