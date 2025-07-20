import { Car } from "./car.model";
import { Cart } from "./cart.model";

export interface CartItem {
  id?: number;
  cart?: Cart;
  carId: number;
  addons: string;
  washPackageId: number;
  car?: Car;
  washPackage?: any;
}