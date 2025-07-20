import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Cart } from 'src/app/models/cart.model';
import { Car } from 'src/app/models/car.model';
import { CartItem } from 'src/app/models/cartitem.model';

@Component({
    selector: 'app-carts',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartsComponent implements OnInit {
    addItemForm: FormGroup;
    myShoppingCarts: Cart[] = [];
    myAwesomeGarage: Car[] = [];
    cartItems: { [cartId: number]: CartItem[] } = {};
    showAddItemForm: number | null = null;
    expandedCart: number | null = null;
    isCreatingCart = false;
    isAddingItem = false;
    isDeletingCart = false;
    isRemovingItem = false;

    constructor(
        private formBuilder: FormBuilder,
        private apiMagician: ApiService
    ) {
        this.addItemForm = this.formBuilder.group({
            carId: ['', Validators.required],
            washPackageId: ['', Validators.required],
            addons: ['']
        });
    }

    ngOnInit() {
        // Using demo data for now
        this.loadDemoData();
        // Uncomment below to use real API data
        // this.loadRealData();
    }

    loadDemoData() {
        // Set demo shopping carts
        this.myShoppingCarts = [
            { id: 1, userId: 1 },
            { id: 2, userId: 1 },
            { id: 3, userId: 1 }
        ];

        // Set demo garage cars
        this.myAwesomeGarage = [
            {
                id: 1,
                carName: 'Toyota Camry',
                model: '2022',
                licensePlate: 'ABC-123',
                userId: 1
            },
            {
                id: 2,
                carName: 'Honda Civic',
                model: '2021',
                licensePlate: 'XYZ-789',
                userId: 1
            },
            {
                id: 3,
                carName: 'Ford F-150',
                model: '2023',
                licensePlate: 'DEF-456',
                userId: 1
            }
        ];

        // Set demo cart items for each cart
        this.cartItems = {
            1: [
                {
                    id: 101,
                    carId: 1,
                    washPackageId: 1,
                    addons: 'wax,vacuum'
                },
                {
                    id: 102,
                    carId: 2,
                    washPackageId: 2,
                    addons: 'air freshener'
                }
            ],
            2: [
                {
                    id: 201,
                    carId: 3,
                    washPackageId: 1,
                    addons: 'tire shine,interior cleaning'
                }
            ],
            3: [] // Empty cart
        };
    }

    loadRealData() {
        this.loadMyShoppingCarts();
        this.loadMyGarage();
    }

    loadMyShoppingCarts() {
        this.apiMagician.getAllMyShoppingCarts().subscribe(
            (carts) => {
                this.myShoppingCarts = carts;
            },
            (error) => {
                console.error('Failed to load carts:', error);
                alert('Failed to load your carts. Please refresh the page.');
            }
        );
    }

    loadMyGarage() {
        this.apiMagician.getMyGarage().subscribe(
            (cars) => {
                this.myAwesomeGarage = cars;
            },
            (error) => {
                console.error('Failed to load garage:', error);
            }
        );
    }

    createNewShoppingCart() {
        this.isCreatingCart = true;

        // Using demo mode - simulate API call with timeout
        setTimeout(() => {
            const newId = Math.max(...this.myShoppingCarts.map(cart => cart.id || 0), 0) + 1;
            const newCart = { id: newId, userId: 1 };

            console.log('Cart created successfully (demo):', newCart);
            this.myShoppingCarts.push(newCart);
            this.cartItems[newId] = []; // Initialize empty cart items
            this.isCreatingCart = false;
            alert('New shopping cart created! 🛒');
        }, 800); // Simulate API delay

        // Uncomment below to use real API
        // this.createNewShoppingCartReal();
    }

    createNewShoppingCartReal() {
        this.isCreatingCart = true;

        this.apiMagician.createShoppingCart().subscribe(
            (newCart) => {
                console.log('Cart created successfully:', newCart);
                this.myShoppingCarts.push(newCart);
                this.isCreatingCart = false;
                alert('New shopping cart created! 🛒');
            },
            (error) => {
                console.error('Failed to create cart:', error);
                this.isCreatingCart = false;
                alert('Failed to create cart. Please try again.');
            }
        );
    }

    deleteShoppingCart(cartId: number) {
        if (confirm('Are you sure you want to delete this cart? All items will be lost! 😱')) {
            this.isDeletingCart = true;

            // Using demo mode - simulate API call with timeout
            setTimeout(() => {
                console.log('Cart deleted successfully (demo):', cartId);
                this.myShoppingCarts = this.myShoppingCarts.filter(cart => cart.id !== cartId);
                delete this.cartItems[cartId];
                this.isDeletingCart = false;
                alert('Shopping cart deleted! 🗑️');
            }, 600); // Simulate API delay

            // Uncomment below to use real API
            // this.deleteShoppingCartReal(cartId);
        }
    }

    deleteShoppingCartReal(cartId: number) {
        if (confirm('Are you sure you want to delete this cart? All items will be lost! 😱')) {
            this.isDeletingCart = true;

            this.apiMagician.deleteShoppingCart(cartId).subscribe(
                (response) => {
                    console.log('Cart deleted successfully:', response);
                    this.myShoppingCarts = this.myShoppingCarts.filter(cart => cart.id !== cartId);
                    delete this.cartItems[cartId];
                    this.isDeletingCart = false;
                    alert('Shopping cart deleted! 🗑️');
                },
                (error) => {
                    console.error('Failed to delete cart:', error);
                    this.isDeletingCart = false;
                    alert('Failed to delete cart. Please try again.');
                }
            );
        }
    }

    toggleAddItemForm(cartId: number) {
        this.showAddItemForm = this.showAddItemForm === cartId ? null : cartId;
        this.addItemForm.reset();
    }

    addItemToShoppingCart(cartId: number) {
        if (this.addItemForm.valid) {
            this.isAddingItem = true;
            const formValue = this.addItemForm.value;

            // Using demo mode - simulate API call with timeout
            setTimeout(() => {
                const newId = Math.max(
                    ...Object.values(this.cartItems)
                        .flat()
                        .map(item => item.id || 0),
                    0
                ) + 1;

                const itemToAdd: CartItem = {
                    id: newId,
                    carId: parseInt(formValue.carId),
                    washPackageId: parseInt(formValue.washPackageId),
                    addons: formValue.addons || ''
                };

                console.log('Item added successfully (demo):', itemToAdd);

                if (!this.cartItems[cartId]) {
                    this.cartItems[cartId] = [];
                }
                this.cartItems[cartId].push(itemToAdd);

                this.addItemForm.reset();
                this.showAddItemForm = null;
                this.isAddingItem = false;
                alert('Item added to cart! 🎉');
            }, 1000); // Simulate API delay

            // Uncomment below to use real API
            // this.addItemToShoppingCartReal(cartId);
        }
    }

    addItemToShoppingCartReal(cartId: number) {
        if (this.addItemForm.valid) {
            this.isAddingItem = true;
            const formValue = this.addItemForm.value;
            const itemToAdd: CartItem = {
                carId: formValue.carId,
                washPackageId: formValue.washPackageId,
                addons: formValue.addons || ''
            };

            this.apiMagician.addItemToShoppingCart(cartId, itemToAdd).subscribe(
                (addedItem) => {
                    console.log('Item added successfully:', addedItem);
                    this.loadCartItems(cartId);
                    this.addItemForm.reset();
                    this.showAddItemForm = null;
                    this.isAddingItem = false;
                    alert('Item added to cart! 🎉');
                },
                (error) => {
                    console.error('Failed to add item:', error);
                    this.isAddingItem = false;
                    alert('Failed to add item. Please try again.');
                }
            );
        }
    }

    loadCartItems(cartId: number) {
        if (this.expandedCart === cartId) {
            this.expandedCart = null;
            return;
        }

        this.expandedCart = cartId;

        // In demo mode, items are already loaded, no need for API call
        // Items are already in this.cartItems[cartId] from loadDemoData()

        // Uncomment below to use real API
        // this.loadCartItemsReal(cartId);
    }

    loadCartItemsReal(cartId: number) {
        this.expandedCart = cartId;

        this.apiMagician.getCartTreasures(cartId).subscribe(
            (items) => {
                this.cartItems[cartId] = items;
            },
            (error) => {
                console.error('Failed to load cart items:', error);
                alert('Failed to load cart items. Please try again.');
            }
        );
    }

    removeItemFromCart(cartId: number, itemId: number) {
        if (confirm('Remove this item from cart? 🤔')) {
            this.isRemovingItem = true;

            // Using demo mode - simulate API call with timeout
            setTimeout(() => {
                console.log('Item removed successfully (demo)');
                this.cartItems[cartId] = this.cartItems[cartId].filter(item => item.id !== itemId);
                this.isRemovingItem = false;
                alert('Item removed from cart! 👋');
            }, 700); // Simulate API delay

            // Uncomment below to use real API
            // this.removeItemFromCartReal(cartId, itemId);
        }
    }

    removeItemFromCartReal(cartId: number, itemId: number) {
        if (confirm('Remove this item from cart? 🤔')) {
            this.isRemovingItem = true;

            this.apiMagician.removeItemFromCart(cartId, itemId).subscribe(
                (updatedItems) => {
                    console.log('Item removed successfully');
                    this.cartItems[cartId] = updatedItems;
                    this.isRemovingItem = false;
                    alert('Item removed from cart! 👋');
                },
                (error) => {
                    console.error('Failed to remove item:', error);
                    this.isRemovingItem = false;
                    alert('Failed to remove item. Please try again.');
                }
            );
        }
    }

    getCartItemsCount(cartId: number): number {
        return this.cartItems[cartId]?.length || 0;
    }
}