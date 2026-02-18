import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { fetchIsraelCities } from '../../data/index';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  router = inject(Router);
  http = inject(HttpClient);

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  shippingCost: number = 0;
  shippingDescription: string = '';
  shippingDetails: string[] = [];
  activeTab: string = 'customer'; // 'customer', 'payment', 'summary'
  isProcessing: boolean = false;
  orderSuccess: boolean = false;
  cities: string[] = [];
  filteredCities: string[] = [];
  citySearchTerm: string = '';
  showCityDropdown: boolean = false;

  // Customer Info
  customerInfo = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    street: '',
    houseNumber: '',
    notes: ''
  };

  // Payment Info
  paymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  ngOnInit() {
    // Load shipping config from JSON
    this.http.get<any>('/assets/config/shipping.json').subscribe(config => {
      this.shippingCost = config.shipping.cost;
      this.shippingDescription = config.shipping.description;
      this.shippingDetails = config.shipping.details;
    });

    // Load cities from API
    fetchIsraelCities(this.http).then((cities: string[]) => {
      this.cities = cities;
      this.filteredCities = cities;
    });

    // Load user info from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('Current user loaded:', currentUser);
      this.customerInfo = {
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || '',
        city: currentUser.city || '',
        street: currentUser.street || '',
        houseNumber: currentUser.houseNumber || '',
        notes: ''
      };
      console.log('Customer info after loading:', this.customerInfo);
    }

    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.customerInfo = {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          city: user.city || '',
          street: user.street || '',
          houseNumber: user.houseNumber || '',
          notes: ''
        };
        console.log('Customer info updated from subscription:', this.customerInfo);
      }
    });

    // Load cart items
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      this.totalQuantity = this.getTotalQuantity();
    });
  }

  filterCities() {
    const searchTerm = this.citySearchTerm.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredCities = this.cities;
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.toLowerCase().includes(searchTerm)
      );
    }
  }

  toggleCityDropdown() {
    this.showCityDropdown = !this.showCityDropdown;
    if (this.showCityDropdown) {
      this.citySearchTerm = '';
      this.filteredCities = this.cities;
    }
  }

  selectCity(city: string) {
    this.customerInfo.city = city;
    this.showCityDropdown = false;
    this.citySearchTerm = '';
    this.filteredCities = this.cities;
  }

  closeCityDropdown() {
    this.showCityDropdown = false;
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalWithShipping(): number {
    return this.totalPrice + this.shippingCost;
  }

  setTab(tab: string) {
    this.activeTab = tab;
    // גלול למעלה כשמעברים בין טאבים
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isTabValid(tab: string): boolean {
    if (tab === 'customer') {
      return !!(this.customerInfo.fullName && this.customerInfo.email && this.customerInfo.phone && 
                this.customerInfo.city && this.customerInfo.street && this.customerInfo.houseNumber);
    }
    if (tab === 'payment') {
      return !!(this.paymentInfo.cardNumber && this.paymentInfo.expiryDate && this.paymentInfo.cvv);
    }
    if (tab === 'summary') {
      return !!(this.isTabValid('customer') && this.isTabValid('payment'));
    }
    return true;
  }

  completeOrder() {
    this.isProcessing = true;
    
    // בנייה של אובייקט ההזמנה
    const currentUser = this.authService.getCurrentUser();
    const order: Order = {
      custId: currentUser?.id || 0, // ID של הלקוח
      date: new Date(),
      status: "חדש",
      items: this.cartItems.map(item => ({
        bookId: item.book.id,
        bookName: item.book.bookName,
        quantity: item.quantity,
        price: item.book.price
      })),
      totalPrice: this.totalPrice,
      shippingCost: this.shippingCost,
      totalAmount: this.totalPrice + this.shippingCost,
      street: this.customerInfo.street,
      houseNumber: this.customerInfo.houseNumber,
      city: this.customerInfo.city,
      email: this.customerInfo.email,
      phone: this.customerInfo.phone,
      notes: this.customerInfo.notes
    };

    // שליחת ההזמנה לשרת
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.orderSuccess = true;
        
        // מחיקת העגלה
        this.cartService.clearCart();
        
        // ניווט הביתה אחרי 3 שניות
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        this.isProcessing = false;
        alert('שגיאה ביצירת הזמנה: ' + (err.error?.message || 'נסה שוב מאוחר יותר'));
        console.error('Order creation error:', err);
      }
    });
  }

  formatCardNumber(value: string): string {
    const clean = value.replace(/\D/g, '');
    const parts = clean.match(/.{1,4}/g) || [];
    return parts.join(' ');
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}

