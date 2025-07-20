import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending-orders`);
  }

  acceptOrder(orderId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/washer/accept-order/${orderId}`, {});
  }

  completeOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/washer/complete-order/${orderId}`, {});
  }

  updateOrdersList(orders: Order[]): void {
    this.ordersSubject.next(orders);
  }

  removeOrderFromList(orderId: number): void {
    const currentOrders = this.ordersSubject.value;
    const updatedOrders = currentOrders.filter(order => order.id !== orderId);
    this.ordersSubject.next(updatedOrders);
  }
}