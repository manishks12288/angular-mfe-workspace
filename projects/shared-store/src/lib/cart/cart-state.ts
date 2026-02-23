import { Product } from 'shared-models';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
}

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  itemCount: 0
};