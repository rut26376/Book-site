import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
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
  router = inject(Router);
  http = inject(HttpClient);

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
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
    street: ''
  };

  // Payment Info
  paymentInfo = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  };

  ngOnInit() {
    // Load cities from API
    fetchIsraelCities(this.http).then((cities: string[]) => {
      this.cities = cities;
      this.filteredCities = cities;
    });

    // Load user info from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.customerInfo = {
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || '',
        city: currentUser.city || '',
        street: currentUser.street || ''
      };
    }

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

  setTab(tab: string) {
    this.activeTab = tab;
  }

  isTabValid(tab: string): boolean {
    if (tab === 'customer') {
      return !!(this.customerInfo.fullName && this.customerInfo.email && this.customerInfo.phone);
    }
    if (tab === 'payment') {
      return !!(this.paymentInfo.cardNumber && this.paymentInfo.cardHolder && this.paymentInfo.expiryDate && this.paymentInfo.cvv);
    }
    return true;
  }

  completeOrder() {
    this.isProcessing = true;
    
    // Simulate payment processing
    setTimeout(() => {
      this.isProcessing = false;
      this.orderSuccess = true;
      
      // Clear cart after successful order
      this.cartService.clearCart();
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }, 2000);
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

