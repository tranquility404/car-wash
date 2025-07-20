import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    totalRidesInGarage = 0;
    totalShoppingCarts = 0;
    totalOrdersEverMade = 0;
    pendingOrdersCount = 0;
    recentOrderHistory: any[] = [];

    constructor(private apiMagician: ApiService) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.apiMagician.getMyGarage().subscribe(
            (cars) => this.totalRidesInGarage = cars.length,
            (error) => console.error('Failed to load garage:', error)
        );

        this.apiMagician.getAllMyShoppingCarts().subscribe(
            (carts) => this.totalShoppingCarts = carts.length,
            (error) => console.error('Failed to load carts:', error)
        );

        this.apiMagician.getMyOrderHistory().subscribe(
            (orders) => {
                this.totalOrdersEverMade = orders.length;
                this.recentOrderHistory = orders;
            },
            (error) => console.error('Failed to load orders:', error)
        );

        this.apiMagician.getPendingOrders().subscribe(
            (pendingOrders) => this.pendingOrdersCount = pendingOrders.length,
            (error) => console.error('Failed to load pending orders:', error)
        );
    }
}