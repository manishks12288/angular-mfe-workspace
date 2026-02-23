import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  removeFromCart,
  updateQuantity,
  clearCart
} from 'shared-store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'cart.html',
  styleUrl: 'cart.css'
})
export class Cart {
  private store = inject(Store);
  
  cartItems = this.store.selectSignal(selectCartItems);
  cartTotal = this.store.selectSignal(selectCartTotal);
  cartCount = this.store.selectSignal(selectCartCount);

  removeItem(productId: number) {
    this.store.dispatch(removeFromCart({ productId }));
  }

  increaseQuantity(productId: number, currentQuantity: number) {
    this.store.dispatch(updateQuantity({ 
      productId, 
      quantity: currentQuantity + 1 
    }));
  }

  decreaseQuantity(productId: number, currentQuantity: number) {
    const newQuantity = Math.max(0, currentQuantity - 1);
    this.store.dispatch(updateQuantity({ 
      productId, 
      quantity: newQuantity 
    }));
  }

  clearAllItems() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.store.dispatch(clearCart());
    }
  }
}