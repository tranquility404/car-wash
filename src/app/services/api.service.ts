import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Car } from '../models/car.model';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cartitem.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/user';
  private magicHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  constructor(private httpWizard: HttpClient) { }

  updateUser(userToTransform: User): Observable<User> {
    return this.httpWizard.put<User>(`${this.baseUrl}/update-user`, userToTransform, { headers: this.magicHeaders });
  }

  changePassword(oldSecretCode: string, newSecretCode: string): Observable<string> {
    return this.httpWizard.put<string>(`${this.baseUrl}/change-password`, {}, {
      headers: this.magicHeaders,
      params: { oldPassword: oldSecretCode, newPassword: newSecretCode }
    });
  }

  addRideToGarage(shinyNewRide: Car): Observable<Car> {
    return this.httpWizard.post<Car>(`${this.baseUrl}/add-car`, shinyNewRide, { headers: this.magicHeaders });
  }

  getMyGarage(): Observable<Car[]> {
    return this.httpWizard.get<Car[]>(`${this.baseUrl}/get-my-car`, { headers: this.magicHeaders });
  }

  deleteMyRide(carId: number): Observable<string> {
    return this.httpWizard.delete<string>(`${this.baseUrl}/delete-my-car/${carId}`, { headers: this.magicHeaders });
  }

  createShoppingCart(): Observable<Cart> {
    return this.httpWizard.post<Cart>(`${this.baseUrl}/carts/create`, {}, { headers: this.magicHeaders });
  }

  deleteShoppingCart(cartId: number): Observable<string> {
    return this.httpWizard.delete<string>(`${this.baseUrl}/carts/delete-cart/${cartId}`, { headers: this.magicHeaders });
  }

  getAllMyShoppingCarts(): Observable<Cart[]> {
    return this.httpWizard.get<Cart[]>(`${this.baseUrl}/carts/get-all-carts`, { headers: this.magicHeaders });
  }

  addItemToShoppingCart(cartId: number, itemToAdd: CartItem): Observable<CartItem> {
    return this.httpWizard.post<CartItem>(`${this.baseUrl}/carts/add-item/${cartId}`, itemToAdd, { headers: this.magicHeaders });
  }

  getCartTreasures(cartId: number): Observable<CartItem[]> {
    return this.httpWizard.get<CartItem[]>(`${this.baseUrl}/carts/get-items/${cartId}`, { headers: this.magicHeaders });
  }

  removeItemFromCart(cartId: number, itemId: number): Observable<CartItem[]> {
    return this.httpWizard.delete<CartItem[]>(`${this.baseUrl}/carts/delete-items/${cartId}/${itemId}`, { headers: this.magicHeaders });
  }

  placeTheOrder(orderToPlace: Order): Observable<Order> {
    return this.httpWizard.post<Order>(`${this.baseUrl}/place-order`, orderToPlace, { headers: this.magicHeaders });
  }

  payTheOrder(): Observable<string> {
    return this.httpWizard.post<string>(`${this.baseUrl}/pay-order`, {}, { headers: this.magicHeaders });
  }

  deleteTheOrder(): Observable<Order> {
    return this.httpWizard.delete<Order>(`${this.baseUrl}/delete-order`, { headers: this.magicHeaders });
  }

  getMyOrderHistory(): Observable<Order[]> {
    return this.httpWizard.get<Order[]>(`${this.baseUrl}/get-order`, { headers: this.magicHeaders });
  }

  getPendingOrders(): Observable<Order[]> {
    return this.httpWizard.get<Order[]>(`${this.baseUrl}/get-pending-order`, { headers: this.magicHeaders });
  }
}