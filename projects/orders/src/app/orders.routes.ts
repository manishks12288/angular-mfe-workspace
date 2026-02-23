import { Routes } from '@angular/router';
import { OrderList } from './features/order-list/order-list';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrderList
  }
];