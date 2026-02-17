import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, AuthModalComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);
  authService = inject(AuthService);

  @ViewChild(AuthModalComponent) authModal!: AuthModalComponent;

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      this.totalQuantity = this.getTotalQuantity();
    });
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  removeItem(bookId: number) {
    this.cartService.removeFromCart(bookId);
  }

  updateQuantity(bookId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(bookId, quantity);
    }
  }

  increaseQuantity(bookId: number) {
    const item = this.cartItems.find(i => i.book.id === bookId);
    if (item) {
      this.updateQuantity(bookId, item.quantity + 1);
    }
  }

  decreaseQuantity(bookId: number) {
    const item = this.cartItems.find(i => i.book.id === bookId);
    if (item && item.quantity > 1) {
      this.updateQuantity(bookId, item.quantity - 1);
    }
  }

  clearCart() {
    if (confirm('האם אתה בטוח שתרצה לנקות את כל העגלה?')) {
      this.cartService.clearCart();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  checkout() {
    if (this.cartItems.length === 0) {
      alert('העגלה שלך ריקה');
      return;
    }

    // בדוק אם המשתמש מחובר
    if (!this.authService.isLoggedIn()) {
      alert('אנא התחבר כדי להמשיך בקנייה');
      this.authModal.openModal(true); // פתח את מודל ההתחברות
      return;
    }

    // עבור לעמוד הזמנה
    this.router.navigate(['/order']);
  }
}
