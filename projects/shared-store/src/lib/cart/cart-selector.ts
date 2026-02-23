import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart-state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartTotal = createSelector(
  selectCartState,
  (state) => state.totalPrice
);

export const selectCartCount = createSelector(
  selectCartState,
  (state) => state.itemCount
);

export const selectCartItemById = (productId: number) => createSelector(
  selectCartItems,
  (items) => items.find(item => item.product.id === productId)
);