import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery: string = '';
  filterStatus: string = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
        this.filteredOrders = response;
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        alert('שגיאה בטעינת ההזמנות');
      }
    });
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchQuery ||
        order.id?.toString().includes(this.searchQuery) ||
        order.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = !this.filterStatus ||
        order.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  deleteOrder(orderId: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          alert('ההזמנה נמחקה בהצלחה!');
          this.loadOrders();
        },
        error: (err: any) => {
          alert('שגיאה במחיקת ההזמנה');
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    return `status-${status}`;
  }

  get uniqueStatuses(): string[] {
    const statuses = new Set(this.orders.map(o => o.status));
    return Array.from(statuses).sort();
  }
}
