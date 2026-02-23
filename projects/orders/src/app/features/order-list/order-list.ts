import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'shared-ui';
import { Order } from 'shared-models';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, Button],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList {
  orders: Order[] = [
    { id: 1, productId: 1, quantity: 2, totalPrice: 1998, status: 'delivered', orderDate: new Date('2024-01-15') },
    { id: 2, productId: 2, quantity: 1, totalPrice: 29, status: 'shipped', orderDate: new Date('2024-02-01') },
    { id: 3, productId: 3, quantity: 1, totalPrice: 79, status: 'pending', orderDate: new Date('2024-02-10') },
  ];
}

