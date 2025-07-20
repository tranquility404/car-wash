import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models/user.model';
import { Car } from 'src/app/models/car.model';
import { WashPackage } from 'src/app/models/washpackage.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    totalUsers = 0;
    totalCars = 0;
    totalPackages = 0;
    activePackages = 0;
    recentActivities: any[] = [];

    // Modal controls
    showUsersModal = false;
    showCarsModal = false;
    showPackageModal = false;
    showPackagesModal = false; // New modal for viewing packages

    // Data arrays
    allUsers: User[] = [];
    allCars: Car[] = [];
    allPackages: WashPackage[] = []; // Store all packages
    filteredUsers: User[] = [];
    filteredCars: Car[] = [];
    filteredPackages: WashPackage[] = []; // Filtered packages

    // Search terms
    userSearchTerm = '';
    carSearchTerm = '';
    packageSearchTerm = ''; // Search term for packages

    // Loading states
    loadingUserId: number | null = null;
    loadingCarId: number | null = null;
    loadingPackageId: number | null = null; // Loading state for package operations
    isAddingPackage = false;

    // Data mode (demo or real)
    isDemoMode = true; // Set to false to use real data

    // New package form
    newPackage: Omit<WashPackage, 'id'> = {
        name: '',
        description: '',
        price: 0,
        duration: 0,
        services: [],
        isActive: true
    };

    availableServices = [
        'Exterior Wash',
        'Interior Cleaning',
        'Wax Application',
        'Tire Shine',
        'Dashboard Polish',
        'Window Cleaning',
        'Vacuum Service',
        'Engine Bay Cleaning',
        'Undercarriage Wash',
        'Ceramic Coating'
    ];

    constructor(private adminService: AdminService, private router: Router) { }

    ngOnInit() {
        // Load data based on mode
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
    }

    // Demo data function for testing UI
    loadDemoData() {
        // Demo users data
        this.allUsers = [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1-555-0123', address: '123 Main St, New York, NY' },
            { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1-555-0124', address: '456 Oak Ave, Los Angeles, CA' },
            { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+1-555-0125', address: '789 Pine Rd, Chicago, IL' },
            { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '+1-555-0126', address: '321 Elm St, Houston, TX' },
            { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+1-555-0127', address: '654 Maple Dr, Phoenix, AZ' },
            { id: 6, name: 'Lisa Davis', email: 'lisa.davis@example.com', phone: '+1-555-0128', address: '987 Cedar Ln, Philadelphia, PA' },
            { id: 7, name: 'Robert Miller', email: 'robert.miller@example.com', phone: '+1-555-0129', address: '147 Birch St, San Antonio, TX' },
            { id: 8, name: 'Emily Taylor', email: 'emily.taylor@example.com', phone: '+1-555-0130', address: '258 Spruce Ave, San Diego, CA' }
        ];

        // Demo cars data
        this.allCars = [
            { id: 1, carName: 'Toyota Camry', model: '2022', licensePlate: 'ABC-1234', userId: 1 },
            { id: 2, carName: 'Honda Civic', model: '2021', licensePlate: 'XYZ-5678', userId: 2 },
            { id: 3, carName: 'Ford F-150', model: '2023', licensePlate: 'DEF-9012', userId: 3 },
            { id: 4, carName: 'BMW X5', model: '2022', licensePlate: 'GHI-3456', userId: 4 },
            { id: 5, carName: 'Mercedes C-Class', model: '2021', licensePlate: 'JKL-7890', userId: 5 },
            { id: 6, carName: 'Audi A4', model: '2023', licensePlate: 'MNO-2345', userId: 6 },
            { id: 7, carName: 'Chevrolet Malibu', model: '2020', licensePlate: 'PQR-6789', userId: 7 },
            { id: 8, carName: 'Nissan Altima', model: '2022', licensePlate: 'STU-0123', userId: 8 },
            { id: 9, carName: 'Hyundai Elantra', model: '2021', licensePlate: 'VWX-4567', userId: 1 },
            { id: 10, carName: 'Volkswagen Jetta', model: '2023', licensePlate: 'YZA-8901', userId: 2 }
        ];

        // Demo packages data
        this.allPackages = [
            {
                id: 1,
                name: 'Basic Wash',
                description: 'Essential car cleaning service with exterior wash and interior vacuum.',
                price: 15.99,
                duration: 30,
                services: ['Exterior Wash', 'Window Cleaning', 'Vacuum Service'],
                isActive: true
            },
            {
                id: 2,
                name: 'Premium Wash',
                description: 'Complete car detailing with wax application and tire shine.',
                price: 29.99,
                duration: 60,
                services: ['Exterior Wash', 'Interior Cleaning', 'Wax Application', 'Tire Shine', 'Window Cleaning', 'Vacuum Service'],
                isActive: true
            },
            {
                id: 3,
                name: 'Luxury Detail',
                description: 'Full-service premium detailing with ceramic coating and engine bay cleaning.',
                price: 59.99,
                duration: 120,
                services: ['Exterior Wash', 'Interior Cleaning', 'Wax Application', 'Tire Shine', 'Dashboard Polish', 'Window Cleaning', 'Vacuum Service', 'Engine Bay Cleaning', 'Ceramic Coating'],
                isActive: true
            },
            {
                id: 4,
                name: 'Express Clean',
                description: 'Quick 15-minute exterior wash for busy customers.',
                price: 9.99,
                duration: 15,
                services: ['Exterior Wash', 'Window Cleaning'],
                isActive: true
            },
            {
                id: 5,
                name: 'Interior Deep Clean',
                description: 'Thorough interior cleaning and sanitization service.',
                price: 24.99,
                duration: 45,
                services: ['Interior Cleaning', 'Dashboard Polish', 'Vacuum Service'],
                isActive: true
            },
            {
                id: 6,
                name: 'Eco Friendly Wash',
                description: 'Environmentally conscious wash using biodegradable products.',
                price: 19.99,
                duration: 40,
                services: ['Exterior Wash', 'Interior Cleaning', 'Window Cleaning'],
                isActive: false
            },
            {
                id: 7,
                name: 'Winter Protection',
                description: 'Special winter package with undercarriage wash and wax protection.',
                price: 34.99,
                duration: 50,
                services: ['Exterior Wash', 'Undercarriage Wash', 'Wax Application', 'Window Cleaning'],
                isActive: true
            },
            {
                id: 8,
                name: 'Show Car Special',
                description: 'Ultimate detailing package for car shows and special events.',
                price: 89.99,
                duration: 180,
                services: ['Exterior Wash', 'Interior Cleaning', 'Wax Application', 'Tire Shine', 'Dashboard Polish', 'Window Cleaning', 'Vacuum Service', 'Engine Bay Cleaning', 'Ceramic Coating', 'Undercarriage Wash'],
                isActive: true
            }
        ];

        // Set filtered arrays
        this.filteredUsers = [...this.allUsers];
        this.filteredCars = [...this.allCars];
        this.filteredPackages = [...this.allPackages];

        // Set statistics
        this.totalUsers = this.allUsers.length;
        this.totalCars = this.allCars.length;
        this.totalPackages = this.allPackages.length; // Use real package count
        this.activePackages = this.allPackages.filter(p => p.isActive).length; // Use real active count

        // Demo recent activities
        this.recentActivities = [
            {
                icon: 'fas fa-user-plus',
                message: 'New user "Emily Taylor" registered',
                timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
            },
            {
                icon: 'fas fa-car',
                message: 'Car "Volkswagen Jetta" added by user',
                timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
            },
            {
                icon: 'fas fa-box',
                message: 'Premium wash package activated',
                timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
            },
            {
                icon: 'fas fa-check-circle',
                message: 'Car wash order completed for BMW X5',
                timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
            },
            {
                icon: 'fas fa-star',
                message: '5-star review received from John Doe',
                timestamp: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
            }
        ];

        console.log('Demo data loaded successfully');
    }

    // Real data function for production use
    async loadRealData() {
        try {
            const [users, cars, packages] = await Promise.all([
                this.adminService.getAllUsers().toPromise(),
                this.adminService.getAllCars().toPromise(),
                this.adminService.getAllWashPackages().toPromise()
            ]);

            this.allUsers = users || [];
            this.allCars = cars || [];
            this.allPackages = packages || [];
            this.filteredUsers = [...this.allUsers];
            this.filteredCars = [...this.allCars];
            this.filteredPackages = [...this.allPackages];

            this.totalUsers = this.allUsers.length;
            this.totalCars = this.allCars.length;
            this.totalPackages = packages?.length || 0;
            this.activePackages = packages?.filter(p => p.isActive).length || 0;

            this.recentActivities = [
                {
                    icon: 'fas fa-user-plus',
                    message: `${this.totalUsers} users registered in the system`,
                    timestamp: new Date(Date.now() - 1000 * 60 * 30)
                },
                {
                    icon: 'fas fa-car',
                    message: `${this.totalCars} cars added to the system`,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60)
                },
                {
                    icon: 'fas fa-box',
                    message: `${this.activePackages} active wash packages available`,
                    timestamp: new Date(Date.now() - 1000 * 60 * 120)
                }
            ];

            console.log('Real data loaded successfully');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');

            // Fallback to demo data if real data fails
            console.log('Falling back to demo data...');
            this.loadDemoData();
        }
    }

    // Update statistics after data changes
    updateStats() {
        this.totalUsers = this.allUsers.length;
        this.totalCars = this.allCars.length;
        // Note: totalPackages and activePackages would need real API calls to update
        // For demo purposes, we keep them static
    }

    // Switch between demo and real data
    toggleDataMode() {
        this.isDemoMode = !this.isDemoMode;
        if (this.isDemoMode) {
            this.loadDemoData();
        } else {
            this.loadRealData();
        }
        console.log(`Switched to ${this.isDemoMode ? 'demo' : 'real'} data mode`);
    }

    // Modal controls
    toggleUsersModal() {
        this.showUsersModal = !this.showUsersModal;
        if (this.showUsersModal) {
            this.loadUsers();
        }
    }

    toggleCarsModal() {
        this.showCarsModal = !this.showCarsModal;
        if (this.showCarsModal) {
            this.loadCars();
        }
    }

    togglePackageModal() {
        this.showPackageModal = !this.showPackageModal;
        if (!this.showPackageModal) {
            this.resetPackageForm();
        }
    }

    togglePackagesModal() {
        this.showPackagesModal = !this.showPackagesModal;
        if (this.showPackagesModal) {
            this.loadPackages();
        }
    }

    // Users management
    async loadUsers() {
        if (this.isDemoMode) {
            // In demo mode, users are already loaded
            this.filteredUsers = [...this.allUsers];
            this.userSearchTerm = '';
            return;
        }

        try {
            this.allUsers = await this.adminService.getAllUsers().toPromise() || [];
            this.filteredUsers = [...this.allUsers];
            this.userSearchTerm = '';
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Failed to load users');
        }
    }

    filterUsers() {
        if (!this.userSearchTerm) {
            this.filteredUsers = [...this.allUsers];
            return;
        }

        const term = this.userSearchTerm.toLowerCase();
        this.filteredUsers = this.allUsers.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            (user.phone && user.phone.toLowerCase().includes(term)) ||
            (user.address && user.address.toLowerCase().includes(term))
        );
    }

    async deleteUser(userId: number) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        this.loadingUserId = userId;
        try {
            if (!this.isDemoMode) {
                await this.adminService.deleteUser(userId).toPromise();
            }

            this.allUsers = this.allUsers.filter(user => user.id !== userId);
            this.filterUsers();
            this.updateStats();
            this.showSuccess('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showError('Failed to delete user');
        } finally {
            this.loadingUserId = null;
        }
    }

    // Cars management
    async loadCars() {
        if (this.isDemoMode) {
            // In demo mode, cars are already loaded
            this.filteredCars = [...this.allCars];
            this.carSearchTerm = '';
            return;
        }

        try {
            this.allCars = await this.adminService.getAllCars().toPromise() || [];
            this.filteredCars = [...this.allCars];
            this.carSearchTerm = '';
        } catch (error) {
            console.error('Error loading cars:', error);
            this.showError('Failed to load cars');
        }
    }

    filterCars() {
        if (!this.carSearchTerm) {
            this.filteredCars = [...this.allCars];
            return;
        }

        const term = this.carSearchTerm.toLowerCase();
        this.filteredCars = this.allCars.filter(car =>
            car.carName.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term) ||
            car.licensePlate.toLowerCase().includes(term) ||
            (car.userId && car.userId.toString().includes(term))
        );
    }

    async deleteCar(carId: number) {
        if (!confirm('Are you sure you want to delete this car?')) {
            return;
        }

        this.loadingCarId = carId;
        try {
            if (!this.isDemoMode) {
                await this.adminService.deleteCar(carId).toPromise();
            }

            this.allCars = this.allCars.filter(car => car.id !== carId);
            this.filterCars();
            this.updateStats();
            this.showSuccess('Car deleted successfully');
        } catch (error) {
            console.error('Error deleting car:', error);
            this.showError('Failed to delete car');
        } finally {
            this.loadingCarId = null;
        }
    }

    // Package management
    async loadPackages() {
        if (this.isDemoMode) {
            // In demo mode, packages are already loaded
            this.filteredPackages = [...this.allPackages];
            this.packageSearchTerm = '';
            return;
        }

        try {
            this.allPackages = await this.adminService.getAllWashPackages().toPromise() || [];
            this.filteredPackages = [...this.allPackages];
            this.packageSearchTerm = '';
        } catch (error) {
            console.error('Error loading packages:', error);
            this.showError('Failed to load packages');
        }
    }

    filterPackages() {
        if (!this.packageSearchTerm) {
            this.filteredPackages = [...this.allPackages];
            return;
        }

        const term = this.packageSearchTerm.toLowerCase();
        this.filteredPackages = this.allPackages.filter(pkg =>
            pkg.name.toLowerCase().includes(term) ||
            pkg.description.toLowerCase().includes(term) ||
            pkg.services.some(service => service.toLowerCase().includes(term)) ||
            pkg.price.toString().includes(term)
        );
    }

    editPackage(pkg: WashPackage) {
        // Populate the form with existing package data
        this.newPackage = {
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            duration: pkg.duration,
            services: [...pkg.services],
            isActive: pkg.isActive
        };

        // Switch to add package modal for editing
        this.showPackagesModal = false;
        this.showPackageModal = true;

        this.showSuccess('Package loaded for editing. Make your changes and click "Add Package" to update.');
    }

    async deletePackage(packageId: number) {
        if (!confirm('Are you sure you want to delete this package?')) {
            return;
        }

        this.loadingPackageId = packageId;
        try {
            if (!this.isDemoMode) {
                // Note: You'll need to add deleteWashPackage method to AdminService
                // await this.adminService.deleteWashPackage(packageId).toPromise();
                this.showError('Delete package functionality needs to be implemented in the backend service');
                return;
            }

            this.allPackages = this.allPackages.filter(pkg => pkg.id !== packageId);
            this.filterPackages();
            this.updatePackageStats();
            this.showSuccess('Package deleted successfully');
        } catch (error) {
            console.error('Error deleting package:', error);
            this.showError('Failed to delete package');
        } finally {
            this.loadingPackageId = null;
        }
    }

    updatePackageStats() {
        this.totalPackages = this.allPackages.length;
        this.activePackages = this.allPackages.filter(p => p.isActive).length;
    }

    // Package form management
    toggleService(service: string, event: any) {
        if (event.target.checked) {
            if (!this.newPackage.services.includes(service)) {
                this.newPackage.services.push(service);
            }
        } else {
            this.newPackage.services = this.newPackage.services.filter(s => s !== service);
        }
    }

    resetPackageForm() {
        this.newPackage = {
            name: '',
            description: '',
            price: 0,
            duration: 0,
            services: [],
            isActive: true
        };
    }

    async addPackage() {
        if (!this.newPackage.name || !this.newPackage.description || this.newPackage.price <= 0 || this.newPackage.duration <= 0) {
            this.showError('Please fill all required fields');
            return;
        }

        this.isAddingPackage = true;
        try {
            if (!this.isDemoMode) {
                const packageToAdd: WashPackage = {
                    ...this.newPackage,
                    id: 0 // Backend will assign actual ID
                };
                await this.adminService.addWashPackage(packageToAdd).toPromise();
            }

            this.showSuccess('Package added successfully');
            this.resetPackageForm();
            this.togglePackageModal();

            // Update package count in demo mode
            if (this.isDemoMode) {
                // Add new package to demo data
                const newId = Math.max(...this.allPackages.map(p => p.id)) + 1;
                const newPackage: WashPackage = {
                    ...this.newPackage,
                    id: newId
                };
                this.allPackages.push(newPackage);
                this.updatePackageStats();
            }
        } catch (error) {
            console.error('Error adding package:', error);
            this.showError('Failed to add package');
        } finally {
            this.isAddingPackage = false;
        }
    }

    // Utility methods
    showSuccess(message: string) {
        // You can implement a toast notification service here
        alert(message);
    }

    showError(message: string) {
        // You can implement a toast notification service here
        alert(message);
    }
}