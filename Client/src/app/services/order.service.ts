import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  //private apiUrl = 'http://localhost:5000/orders';
  private apiUrl = '/orders';

  constructor() { }
  
  createOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/newOrder`, order);
  }

  getAllOrders(): Observable<any> {
     const token = localStorage.getItem('auth_token');
     let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get(`${this.apiUrl}/allOrders`, { headers });
  }

  
  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.put(`${this.apiUrl}/updateStatus`, 
      { orderId, status },
      { headers }
    );
  }
}
