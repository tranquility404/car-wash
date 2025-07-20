import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    myOrderHistory: Order[] = [];
    pendingOrders: Order[] = [];
    completedOrders: Order[] = [];
    filteredOrders: Order[] = [];
    selectedStatus: string = 'all';
    searchQuery: string = '';
    isLoading = false;

    // Pagination
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 1;

    // Make Math available to template
    Math = Math;

    // Status options
    statusOptions = [
        { value: 'all', label: 'All Orders', icon: 'fas fa-list' },
        { value: 'PENDING', label: 'Pending', icon: 'fas fa-clock' },
        { value: 'WASHING', label: 'In Progress', icon: 'fas fa-spinner' },
        { value: 'COMPLETED', label: 'Completed', icon: 'fas fa-check-circle' },
        { value: 'CANCELLED', label: 'Cancelled', icon: 'fas fa-times-circle' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private apiMagician: ApiService
    ) { }

    ngOnInit() {
        // Using demo data for now
        this.loadDemoData();
        // Uncomment below to use real API data
        // this.loadRealData();
    }

    loadDemoData() {
        this.isLoading = true;

        // Simulate API delay
        setTimeout(() => {
            // Set demo order history with more comprehensive data
            this.myOrderHistory = [
                {
                    id: 1001,
                    userId: 1,
                    washerId: 101,
                    cartId: 1,
                    status: 'COMPLETED',
                    orderDate: '2025-07-18T10:30:00Z',
                    scheduledDate: '2025-07-18T14:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/1001',
                    paymentId: 2001
                },
                {
                    id: 1002,
                    userId: 1,
                    washerId: 102,
                    cartId: 2,
                    status: 'WASHING',
                    orderDate: '2025-07-19T14:15:00Z',
                    scheduledDate: '2025-07-19T16:00:00Z',
                    orderNow: true,
                    paymentUrl: 'https://payment.example.com/1002',
                    paymentId: 2002
                },
                {
                    id: 1003,
                    userId: 1,
                    washerId: 103,
                    cartId: 3,
                    status: 'PENDING',
                    orderDate: '2025-07-20T09:20:00Z',
                    scheduledDate: '2025-07-20T15:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/1003',
                    paymentId: 2003
                },
                {
                    id: 1004,
                    userId: 1,
                    washerId: 104,
                    cartId: 1,
                    status: 'COMPLETED',
                    orderDate: '2025-07-17T16:45:00Z',
                    scheduledDate: '2025-07-17T18:00:00Z',
                    orderNow: true,
                    paymentUrl: 'https://payment.example.com/1004',
                    paymentId: 2004
                },
                {
                    id: 1005,
                    userId: 1,
                    washerId: 105,
                    cartId: 2,
                    status: 'CANCELLED',
                    orderDate: '2025-07-16T11:30:00Z',
                    scheduledDate: '2025-07-16T17:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/1005',
                    paymentId: 2005
                },
                {
                    id: 1006,
                    userId: 1,
                    washerId: 106,
                    cartId: 3,
                    status: 'PENDING',
                    orderDate: '2025-07-21T08:00:00Z',
                    scheduledDate: '2025-07-21T13:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/1006',
                    paymentId: 2006
                },
                {
                    id: 1007,
                    userId: 1,
                    washerId: 107,
                    cartId: 1,
                    status: 'WASHING',
                    orderDate: '2025-07-20T12:00:00Z',
                    scheduledDate: '2025-07-20T14:30:00Z',
                    orderNow: true,
                    paymentUrl: 'https://payment.example.com/1007',
                    paymentId: 2007
                }
            ];

            this.categorizeOrders();
            this.applyFilters();
            this.isLoading = false;
            console.log('Demo orders data loaded');
        }, 800);
    }

    loadRealData() {
        this.isLoading = true;

        this.apiMagician.getMyOrderHistory().subscribe(
            (orders: Order[]) => {
                this.myOrderHistory = orders;
                this.categorizeOrders();
                this.applyFilters();
                this.isLoading = false;
                console.log('Real orders data loaded:', orders);
            },
            (error: any) => {
                console.error('Failed to load orders:', error);
                this.isLoading = false;
            }
        );
    }

    categorizeOrders() {
        this.pendingOrders = this.myOrderHistory.filter(order =>
            order.status === 'PENDING' || order.status === 'WASHING'
        );
        this.completedOrders = this.myOrderHistory.filter(order =>
            order.status === 'COMPLETED' || order.status === 'CANCELLED'
        );
    }

    applyFilters() {
        let filtered = [...this.myOrderHistory];

        // Apply status filter
        if (this.selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === this.selectedStatus);
        }

        // Apply search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id?.toString().includes(query) ||
                order.status.toLowerCase().includes(query) ||
                order.cartId?.toString().includes(query) ||
                order.washerId?.toString().includes(query)
            );
        }

        this.filteredOrders = filtered;
        this.calculatePagination();
    }

    calculatePagination() {
        this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }

    getPaginatedOrders(): Order[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredOrders.slice(startIndex, endIndex);
    }

    onStatusFilterChange(status: string) {
        this.selectedStatus = status;
        this.currentPage = 1;
        this.applyFilters();
    }

    onSearchChange() {
        this.currentPage = 1;
        this.applyFilters();
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'PENDING': return 'fas fa-clock';
            case 'WASHING': return 'fas fa-spinner fa-spin';
            case 'COMPLETED': return 'fas fa-check-circle';
            case 'CANCELLED': return 'fas fa-times-circle';
            default: return 'fas fa-question-circle';
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'WASHING': return 'status-washing';
            case 'COMPLETED': return 'status-completed';
            case 'CANCELLED': return 'status-cancelled';
            default: return 'status-default';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING': return 'Pending';
            case 'WASHING': return 'In Progress';
            case 'COMPLETED': return 'Completed';
            case 'CANCELLED': return 'Cancelled';
            default: return status;
        }
    }

    viewOrderDetails(order: Order) {
        // TODO: Navigate to order details page or show modal
        console.log('View order details:', order);
        alert(`Order #${order.id} Details:\n\nStatus: ${this.getStatusLabel(order.status)}\nCart ID: ${order.cartId}\nWasher ID: ${order.washerId}\nOrder Date: ${new Date(order.orderDate || '').toLocaleString()}\nScheduled Date: ${new Date(order.scheduledDate || '').toLocaleString()}`);
    }

    cancelOrder(order: Order) {
        if (order.status === 'PENDING' && confirm(`Cancel Order #${order.id}?`)) {
            // Using demo mode - simulate API call
            setTimeout(() => {
                const orderIndex = this.myOrderHistory.findIndex(o => o.id === order.id);
                if (orderIndex !== -1) {
                    this.myOrderHistory[orderIndex].status = 'CANCELLED';
                    this.categorizeOrders();
                    this.applyFilters();
                    alert('Order cancelled successfully!');
                }
            }, 500);

            // Uncomment below to use real API
            // this.cancelOrderReal(order);
        }
    }

    cancelOrderReal(order: Order) {
        // TODO: Implement real API call to cancel order
        console.log('Cancel order via API:', order);
    }

    reorderOrder(order: Order) {
        if (confirm(`Reorder from Order #${order.id}?`)) {
            // TODO: Navigate to cart/order page with pre-filled data
            console.log('Reorder:', order);
            alert(`Reordering from Cart #${order.cartId}... (Feature coming soon!)`);
        }
    }

    trackOrder(order: Order) {
        if (order.status === 'WASHING') {
            // TODO: Navigate to tracking page
            console.log('Track order:', order);
            alert(`Tracking Order #${order.id}... (Feature coming soon!)`);
        }
    }

    makePayment(order: Order) {
        if (order.paymentUrl) {
            // TODO: Open payment gateway or navigate to payment page
            console.log('Make payment for order:', order);
            alert(`Opening payment gateway for Order #${order.id}... (Feature coming soon!)`);
        }
    }
}
