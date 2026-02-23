export interface Order {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: Date;
}