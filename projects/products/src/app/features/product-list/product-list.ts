import { Button } from 'shared-ui';
import { Product } from 'shared-models';
import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addToCart, selectCartItemById } from 'shared-store';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Button, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private store = inject(Store);
  
  // ===== LOCAL STATE WITH SIGNALS =====
  
  // Mock data - in real app, fetch from API
  allProducts = signal<Product[]>([
    { id: 1, name: 'Gaming Laptop', price: 1299, description: 'High-performance gaming laptop with RTX 4070', category: 'electronics' },
    { id: 2, name: 'Wireless Mouse', price: 29, description: 'Ergonomic wireless mouse', category: 'accessories' },
    { id: 3, name: 'Mechanical Keyboard', price: 129, description: 'RGB mechanical keyboard', category: 'accessories' },
    { id: 4, name: '4K Monitor', price: 499, description: '27-inch 4K HDR monitor', category: 'electronics' },
    { id: 5, name: 'Webcam', price: 89, description: '1080p HD webcam', category: 'electronics' },
    { id: 6, name: 'USB-C Hub', price: 45, description: '7-in-1 USB-C hub', category: 'accessories' },
    { id: 7, name: 'Headphones', price: 199, description: 'Noise-canceling headphones', category: 'accessories' },
    { id: 8, name: 'SSD Drive', price: 149, description: '1TB NVMe SSD', category: 'electronics' },
  ]);
  
  searchTerm = signal('');
  sortBy = signal<'name' | 'price-asc' | 'price-desc'>('name');
  filterCategory = signal<'all' | 'electronics' | 'accessories'>('all');
  selectedProduct = signal<Product | null>(null);
  loading = signal(false);
  
  // ===== COMPUTED SIGNALS (DERIVED STATE) =====
  
  filteredProducts = computed(() => {
    let products = this.allProducts();
    
    // Filter by search term
    const search = this.searchTerm().toLowerCase();
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description?.toLowerCase().includes(search)
      );
    }
    
    // Filter by category
    const category = this.filterCategory();
    if (category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    
    // Sort
    const sort = this.sortBy();
    if (sort === 'name') {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'price-asc') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products = [...products].sort((a, b) => b.price - a.price);
    }
    
    return products;
  });
  
  averagePrice = computed(() => {
    const products = this.filteredProducts();
    if (products.length === 0) return 0;
    const sum = products.reduce((acc, p) => acc + p.price, 0);
    return Math.round(sum / products.length);
  });
  
  // ===== EFFECTS (SIDE EFFECTS) =====
  
  constructor() {
    // Effect: Log when filtered products change
    effect(() => {
      console.log('Filtered products count:', this.filteredProducts().length);
    });
    
    // Simulate loading data
    this.loadProducts();
  }
  
  // ===== METHODS =====
  
  loadProducts() {
    this.loading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }
  
  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }
  
  onSortChange(value: 'name' | 'price-asc' | 'price-desc') {
    this.sortBy.set(value);
  }
  
  onFilterChange(value: 'all' | 'electronics' | 'accessories') {
    this.filterCategory.set(value);
  }
  
  onViewDetails(product: Product) {
    this.selectedProduct.set(product);
  }
  
  clearSelection() {
    this.selectedProduct.set(null);
  }
  
  // ===== GLOBAL STATE (NgRx) =====
  
  onAddToCart(product: Product) {
    // Dispatch to global cart state
    this.store.dispatch(addToCart({ product }));
    
    // Show local feedback (could use a signal for toast notification)
    console.log('✅ Added to cart:', product.name);
  }
}
