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
  selectedOrder: Order | null = null;
  showOrderDetails: boolean = false;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response: Order[]) => {
        this.orders = response;
        this.filterOrders();
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

    // Sort by status order
    const statusOrder = { 'חדש': 0, 'בטיפול': 1, 'הושלם': 2 };
    this.filteredOrders.sort((a, b) => {
      const aIndex = statusOrder[a.status as keyof typeof statusOrder];
      const bIndex = statusOrder[b.status as keyof typeof statusOrder];
      return (aIndex ?? 3) - (bIndex ?? 3);
    });
  }

  deleteOrder(orderId: number | undefined) {
    if (!orderId) {
      alert('שגיאה: ID הזמנה לא קיים');
      return;
    }
    
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

  updateOrderStatus(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response: any) => {
        alert('סטטוס הזמנה עודכן בהצלחה!');
        this.loadOrders();
      },
      error: (err: any) => {
        console.error('Error updating order status:', err);
        alert('שגיאה בעדכון הסטטוס');
      }
    });
  }

  onStatusChange(event: any, orderId: number) {
    const newStatus = event.target.value;
    this.updateOrderStatus(orderId, newStatus);
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  printOrder() {
    if (!this.selectedOrder) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('אנא אפשר לדפדפן לפתוח חלון חדש');
      return;
    }

    const itemsHTML = this.selectedOrder.items && this.selectedOrder.items.length > 0
      ? this.selectedOrder.items.map(item => `
          <tr>
            <td>${item.bookName}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: left;">₪${item.price}</td>
            <td style="text-align: left;">₪${item.price * item.quantity}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="4" style="text-align: center;">אין פריטים</td></tr>';

    const html = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>הזמנה #${this.selectedOrder.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #4a3728;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #4a3728;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            background-color: #4a3728;
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            font-weight: bold;
            border-radius: 4px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .info-row label {
            font-weight: bold;
            color: #4a3728;
            flex: 0 0 30%;
          }
          .info-row value {
            flex: 1;
            text-align: left;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          table thead {
            background-color: #f0f0f0;
          }
          table th {
            padding: 10px;
            text-align: right;
            font-weight: bold;
            border-bottom: 2px solid #4a3728;
            color: #4a3728;
          }
          table td {
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
            text-align: right;
          }
          .summary {
            background-color: #f9f9f9;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-weight: 600;
          }
          .summary-row.total {
            border-top: 2px solid #4a3728;
            padding-top: 15px;
            font-size: 16px;
            color: #4a3728;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
          }
          .status-חדש {
            background-color: #e3f2fd;
            color: #1976d2;
          }
          .status-בטיפול {
            background-color: #fff3e0;
            color: #f57c00;
          }
          .status-הושלם {
            background-color: #e8f5e9;
            color: #388e3c;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          @media print {
            body {
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>הזמנה #${this.selectedOrder.id}</h1>
          <p>תאריך: ${new Date(this.selectedOrder.date).toLocaleDateString('he-IL')}</p>
          <p>סטטוס: <span class="status-badge status-${this.selectedOrder.status}">${this.selectedOrder.status}</span></p>
        </div>

        <div class="section">
          <div class="section-title">פרטי הלקוח</div>
          <div class="info-row">
            <label>שם:</label>
            <value>${this.selectedOrder.fullName}</value>
          </div>
          <div class="info-row">
            <label>דוא״ל:</label>
            <value>${this.selectedOrder.email}</value>
          </div>
          <div class="info-row">
            <label>טלפון:</label>
            <value>${this.selectedOrder.phone}</value>
          </div>
          <div class="info-row">
            <label>כתובת:</label>
            <value>${this.selectedOrder.street} ${this.selectedOrder.houseNumber}, ${this.selectedOrder.city}</value>
          </div>
        </div>

        <div class="section">
          <div class="section-title">פריטים בהזמנה</div>
          <table>
            <thead>
              <tr>
                <th>שם הספר</th>
                <th>כמות</th>
                <th>מחיר יחידה</th>
                <th>סך הכל</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>סכום פריטים:</span>
            <span>₪${this.selectedOrder.totalPrice || 0}</span>
          </div>
          <div class="summary-row">
            <span>עלות משלוח:</span>
            <span>₪${this.selectedOrder.shippingCost || 0}</span>
          </div>
          <div class="summary-row total">
            <span>סך הכל:</span>
            <span>₪${this.selectedOrder.totalAmount || 0}</span>
          </div>
        </div>

        ${this.selectedOrder.notes ? `
          <div class="section">
            <div class="section-title">הערות</div>
            <p>${this.selectedOrder.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>תאריך הדפסה: ${new Date().toLocaleDateString('he-IL')} ${new Date().toLocaleTimeString('he-IL')}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  get uniqueStatuses(): string[] {
    const statusOrder = { 'חדש': 0, 'בטיפול': 1, 'הושלם': 2 };
    const statuses = new Set(this.orders.map(o => o.status));
    return Array.from(statuses).sort((a, b) => 
      (statusOrder[a as keyof typeof statusOrder] || 3) - 
      (statusOrder[b as keyof typeof statusOrder] || 3)
    );
  }
}
