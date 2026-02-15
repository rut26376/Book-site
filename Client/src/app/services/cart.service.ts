import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';

export interface CartItem {
  book: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private loadCartFromStorage() {
    // בדוק אם אנחנו בבדיקת SSR (Server-Side Rendering)
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }

  private saveCartToStorage() {
    // בדוק אם אנחנו בבדיקת SSR
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(book: Book, quantity: number = 1) {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(item => item.book.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ book, quantity });
    }

    this.cartItems.next([...currentCart]);
    this.saveCartToStorage();
  }

  removeFromCart(bookId: number) {
    const updatedCart = this.cartItems.value.filter(item => item.book.id !== bookId);
    this.cartItems.next(updatedCart);
    this.saveCartToStorage();
  }

  updateQuantity(bookId: number, quantity: number) {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(item => item.book.id === bookId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(bookId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentCart]);
        this.saveCartToStorage();
      }
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCart() {
    return this.cartItems.value;
  }

  getTotalPrice() {
    return this.cartItems.value.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }
}
