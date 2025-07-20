import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { OrderStatus } from 'src/app/models/orderstatus.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-washer-dashboard',
    templateUrl: './washer-dashboard.component.html',
    styleUrls: ['./washer-dashboard.component.scss']
})

export class WasherDashboardComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    filteredOrders: Order[] = [];
    isLoading = false;
    error: string | null = null;
    selectedFilter = 'all';
    searchTerm = '';
    isDemoMode = true; // Toggle between demo and real data
    totalOrders = 0;
    pendingCount = 0;
    acceptedCount = 0;
    completedCount = 0;
    inProgressCount = 0;
    isDropdownOpen = false;

    private destroy$ = new Subject<void>();

    constructor(private orderService: OrderService) { }

    ngOnInit(): void {
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
        this.subscribeToOrderUpdates();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadOrders(): void {
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
    }

    // Demo data function for testing UI
    loadDemoData(): void {
        this.isLoading = true;
        this.error = null;

        // Simulate loading delay
        setTimeout(() => {
            this.orders = [
                {
                    id: 1,
                    userId: 101,
                    washerId: 5,
                    cartId: 201,
                    status: 'PENDING',
                    orderDate: '2024-01-15T10:30:00Z',
                    scheduledDate: '2024-01-16T14:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/12345',
                    paymentId: 1001
                },
                {
                    id: 2,
                    userId: 102,
                    washerId: 5,
                    cartId: 202,
                    status: 'ACCEPTED',
                    orderDate: '2024-01-15T11:45:00Z',
                    scheduledDate: '2024-01-15T16:30:00Z',
                    orderNow: true,
                    paymentId: 1002
                },
                {
                    id: 3,
                    userId: 103,
                    washerId: 5,
                    cartId: 203,
                    status: 'PENDING',
                    orderDate: '2024-01-15T09:15:00Z',
                    scheduledDate: '2024-01-16T10:00:00Z',
                    orderNow: false,
                    paymentUrl: 'https://payment.example.com/12346',
                    paymentId: 1003
                },
                {
                    id: 4,
                    userId: 104,
                    washerId: 5,
                    cartId: 204,
                    status: 'IN_PROGRESS',
                    orderDate: '2024-01-15T08:00:00Z',
                    scheduledDate: '2024-01-15T13:00:00Z',
                    orderNow: true,
                    paymentId: 1004
                },
                {
                    id: 5,
                    userId: 105,
                    washerId: 5,
                    cartId: 205,
                    status: 'COMPLETED',
                    orderDate: '2024-01-14T15:30:00Z',
                    scheduledDate: '2024-01-15T09:00:00Z',
                    orderNow: false,
                    paymentId: 1005
                }
            ];

            this.updateStats();
            this.applyFilters();
            this.isLoading = false;
            console.log('Demo data loaded successfully');
        }, 1000);
    }

    // Real data function for production use
    loadRealData(): void {
        this.isLoading = true;
        this.error = null;

        this.orderService.getPendingOrders()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (orders) => {
                    this.orders = orders;
                    this.orderService.updateOrdersList(orders);
                    this.updateStats();
                    this.applyFilters();
                    this.isLoading = false;
                    console.log('Real data loaded successfully');
                },
                error: (error) => {
                    this.error = 'Failed to load orders. Please try again.';
                    this.isLoading = false;
                    console.error('Error loading orders:', error);

                    // Fallback to demo data if real data fails
                    console.log('Falling back to demo data...');
                    this.isDemoMode = true;
                    this.loadDemoData();
                }
            });
    }

    subscribeToOrderUpdates(): void {
        this.orderService.orders$
            .pipe(takeUntil(this.destroy$))
            .subscribe(orders => {
                this.orders = orders;
                this.applyFilters();
            });
    }

    onOrderAccepted(orderId: number): void {
        this.orderService.acceptOrder(orderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.updateOrderStatus(orderId, OrderStatus.ACCEPTED);
                    this.showSuccessMessage('Order accepted successfully');
                },
                error: (error) => {
                    this.error = 'Failed to accept order. Please try again.';
                    console.error('Error accepting order:', error);
                }
            });
    }

    onOrderCompleted(orderId: number): void {
        this.orderService.completeOrder(orderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (completedOrder) => {
                    this.orderService.removeOrderFromList(orderId);
                    this.showSuccessMessage('Order completed successfully');
                },
                error: (error) => {
                    this.error = 'Failed to complete order. Please try again.';
                    console.error('Error completing order:', error);
                }
            });
    }

    private updateOrderStatus(orderId: number, status: OrderStatus): void {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = status;
            this.orderService.updateOrdersList([...this.orders]);
        }
    }

    private showSuccessMessage(message: string): void {
        console.log(message);
    }

    // Update statistics based on current orders
    updateStats(): void {
        this.totalOrders = this.orders.length;
        this.pendingCount = this.orders.filter(order => order.status === 'PENDING').length;
        this.acceptedCount = this.orders.filter(order => order.status === 'ACCEPTED').length;
        this.completedCount = this.orders.filter(order => order.status === 'COMPLETED').length;
        this.inProgressCount = this.orders.filter(order => order.status === 'IN_PROGRESS').length;
    }

    // Toggle between demo and real data
    toggleDataMode(): void {
        this.isDemoMode = !this.isDemoMode;
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
        console.log(`Switched to ${this.isDemoMode ? 'demo' : 'real'} data mode`);
    }

    // Get status display text
    getStatusDisplayText(status: string): string {
        switch (status.toLowerCase()) {
            case 'pending': return 'Waiting';
            case 'accepted': return 'Accepted';
            case 'in_progress': return 'In Progress';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    }

    // Get status icon
    getStatusIcon(status: string): string {
        switch (status.toLowerCase()) {
            case 'pending': return 'fas fa-clock';
            case 'accepted': return 'fas fa-handshake';
            case 'in_progress': return 'fas fa-spinner fa-pulse';
            case 'completed': return 'fas fa-check-circle';
            case 'cancelled': return 'fas fa-times-circle';
            default: return 'fas fa-question-circle';
        }
    }

    onFilterChange(filter: string): void {
        this.selectedFilter = filter;
        this.applyFilters();
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    applyFilters(): void {
        let filtered = [...this.orders];

        if (this.selectedFilter !== 'all') {
            filtered = filtered.filter(order =>
                order.status.toLowerCase() === this.selectedFilter.toLowerCase()
            );
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.status.toLowerCase().includes(term) ||
                (order.id && order.id.toString().includes(term)) ||
                (order.userId && order.userId.toString().includes(term)) ||
                (order.orderDate && order.orderDate.toLowerCase().includes(term)) ||
                (order.scheduledDate && order.scheduledDate.toLowerCase().includes(term))
            );
        }

        this.filteredOrders = filtered;
    }

    refreshOrders(): void {
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
    }

    clearError(): void {
        this.error = null;
    }

    // View order details
    viewOrderDetails(order: Order): void {
        const details = `
Order Details:
- Order ID: #${order.id}
- Customer: User #${order.userId}
- Cart ID: #${order.cartId}
- Status: ${this.getStatusDisplayText(order.status)}
- Order Date: ${new Date(order.orderDate || '').toLocaleString()}
- Scheduled Date: ${new Date(order.scheduledDate || '').toLocaleString()}
- Type: ${order.orderNow ? 'Express Order' : 'Scheduled Order'}
- Payment: ${order.paymentUrl ? 'Payment link available' : 'No payment required'}
        `;
        alert(details.trim());
    }

    // Custom dropdown methods
    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectFilter(filter: string): void {
        this.selectedFilter = filter;
        this.isDropdownOpen = false;
        this.applyFilters();
    }

    getFilterIcon(filter: string): string {
        const icons: { [key: string]: string } = {
            'all': 'fa-list-alt',
            'pending': 'fa-clock',
            'accepted': 'fa-handshake',
            'in_progress': 'fa-spinner'
        };
        return icons[filter] || 'fa-list-alt';
    }

    getFilterLabel(filter: string): string {
        const labels: { [key: string]: string } = {
            'all': 'All Orders',
            'pending': 'Pending',
            'accepted': 'Accepted',
            'in_progress': 'In Progress'
        };
        return labels[filter] || 'All Orders';
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        const target = event.target as HTMLElement;
        const filterContainer = target.closest('.filter-container');

        if (!filterContainer && this.isDropdownOpen) {
            this.isDropdownOpen = false;
        }
    }
}