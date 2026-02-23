import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart-state';
import * as CartActions from './cart-action';

export const cartReducer = createReducer(
  initialCartState,
  
  on(CartActions.addToCart, (state, { product }) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Update quantity if item exists
      const updatedItems = state.items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: state.totalPrice + product.price,
        itemCount: state.itemCount + 1
      };
    } else {
      // Add new item
      return {
        ...state,
        items: [...state.items, { product, quantity: 1 }],
        totalPrice: state.totalPrice + product.price,
        itemCount: state.itemCount + 1
      };
    }
  }),
  
  on(CartActions.removeFromCart, (state, { productId }) => {
    const item = state.items.find(i => i.product.id === productId);
    if (!item) return state;
    
    return {
      ...state,
      items: state.items.filter(i => i.product.id !== productId),
      totalPrice: state.totalPrice - (item.product.price * item.quantity),
      itemCount: state.itemCount - item.quantity
    };
  }),
  
  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    const item = state.items.find(i => i.product.id === productId);
    if (!item || quantity < 0) return state;
    
    const quantityDiff = quantity - item.quantity;
    
    if (quantity === 0) {
      return {
        ...state,
        items: state.items.filter(i => i.product.id !== productId),
        totalPrice: state.totalPrice - (item.product.price * item.quantity),
        itemCount: state.itemCount - item.quantity
      };
    }
    
    return {
      ...state,
      items: state.items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
      totalPrice: state.totalPrice + (item.product.price * quantityDiff),
      itemCount: state.itemCount + quantityDiff
    };
  }),
  
  on(CartActions.clearCart, () => initialCartState)
);