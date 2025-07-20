import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Car } from 'src/app/models/car.model';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  addCarForm: FormGroup;
  myAwesomeGarage: Car[] = [];
  showAddCarForm = false;
  isAddingCar = false;
  isDeletingCar = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiMagician: ApiService
  ) {
    this.addCarForm = this.formBuilder.group({
      carName: ['', Validators.required],
      model: ['', Validators.required],
      licensePlate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Using demo data for now
    this.loadDemoData();
    // Uncomment below to use real API data
    // this.loadRealData();
  }

  loadDemoData() {
    // Set demo cars data
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
      },
      {
        id: 4,
        carName: 'Tesla Model 3',
        model: '2022',
        licensePlate: 'ELN-001',
        userId: 1
      },
      {
        id: 5,
        carName: 'BMW X5',
        model: '2020',
        licensePlate: 'BMW-555',
        userId: 1
      }
    ];
  }

  loadRealData() {
    this.apiMagician.getMyGarage().subscribe(
      (cars) => {
        this.myAwesomeGarage = cars;
      },
      (error) => {
        console.error('Failed to load garage:', error);
        alert('Failed to load your cars. Please refresh the page.');
      }
    );
  }

  addNewRideToGarage() {
    if (this.addCarForm.valid) {
      this.isAddingCar = true;
      const newRide: Car = this.addCarForm.value;

      // Using demo mode - simulate API call with timeout
      setTimeout(() => {
        // Generate a fake ID for demo
        const newId = Math.max(...this.myAwesomeGarage.map(car => car.id || 0), 0) + 1;
        const carWithId = { ...newRide, id: newId };

        console.log('Car added successfully (demo):', carWithId);
        this.myAwesomeGarage.push(carWithId);
        this.addCarForm.reset();
        this.showAddCarForm = false;
        this.isAddingCar = false;
        alert('Car added to your garage successfully! 🚗');
      }, 1000); // Simulate 1 second API delay

      // Uncomment below to use real API
      // this.addNewRideToGarageReal();
    }
  }

  addNewRideToGarageReal() {
    if (this.addCarForm.valid) {
      this.isAddingCar = true;
      const newRide: Car = this.addCarForm.value;

      this.apiMagician.addRideToGarage(newRide).subscribe(
        (addedCar) => {
          console.log('Car added successfully:', addedCar);
          this.myAwesomeGarage.push(addedCar);
          this.addCarForm.reset();
          this.showAddCarForm = false;
          this.isAddingCar = false;
          alert('Car added to your garage successfully! 🚗');
        },
        (error) => {
          console.error('Failed to add car:', error);
          this.isAddingCar = false;
          alert('Failed to add car. Please try again.');
        }
      );
    }
  }

  removeRideFromGarage(carId: number) {
    if (confirm('Are you sure you want to remove this car from your garage? 🤔')) {
      this.isDeletingCar = true;

      // Using demo mode - simulate API call with timeout
      setTimeout(() => {
        console.log('Car deleted successfully (demo):', carId);
        this.myAwesomeGarage = this.myAwesomeGarage.filter(car => car.id !== carId);
        this.isDeletingCar = false;
        alert('Car removed from your garage! 👋');
      }, 800); // Simulate API delay

      // Uncomment below to use real API
      // this.removeRideFromGarageReal(carId);
    }
  }

  removeRideFromGarageReal(carId: number) {
    if (confirm('Are you sure you want to remove this car from your garage? 🤔')) {
      this.isDeletingCar = true;

      this.apiMagician.deleteMyRide(carId).subscribe(
        (response) => {
          console.log('Car deleted successfully:', response);
          this.myAwesomeGarage = this.myAwesomeGarage.filter(car => car.id !== carId);
          this.isDeletingCar = false;
          alert('Car removed from your garage! 👋');
        },
        (error) => {
          console.error('Failed to delete car:', error);
          this.isDeletingCar = false;
          alert('Failed to remove car. Please try again.');
        }
      );
    }
  }
}
