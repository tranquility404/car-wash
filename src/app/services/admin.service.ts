import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { WashPackage } from '../models/washpackage.model';
import { Car } from '../models/car.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  async getCurrentUser(): Promise<string> {
    return firstValueFrom(this.http.get<string>(`${this.baseUrl}/me`));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/get-user-by-id/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete-user/${id}`);
  }

  deleteCar(carId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete-car-byid/${carId}`);
  }

  getCarByUserId(id: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}/get-car-by-userid/${id}`);
  }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}/get-all-car`);
  }

  addWashPackage(washPackage: WashPackage): Observable<WashPackage> {
    return this.http.post<WashPackage>(`${this.baseUrl}/add-wash-package`, washPackage);
  }

  getAllWashPackages(): Observable<WashPackage[]> {
    return this.http.get<WashPackage[]>(`${this.baseUrl}/get-all-wash-package`);
  }
}