import { CartItem } from "./cartitem.model";

export interface Cart {
  id?: number;
  userId?: number;
  items?: CartItem[];
}