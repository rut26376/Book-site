import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent implements OnInit {
  cartService = inject(CartService);
  drawerService = inject(CartDrawerService);
  router = inject(Router);
  
  isOpen: boolean = false;
  cartItems: any[] = [];
  totalPrice: number = 0;

  ngOnInit() {
    this.drawerService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items.map(item => ({
        id: item.book.id,
        bookName: item.book.bookName,
        picture: item.book.picture,
        price: item.book.price,
        quantity: item.quantity
      }));
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  removeItem(bookId: number) {
    this.cartService.removeFromCart(bookId);
  }

  goToCart() {
    this.drawerService.close();
    this.router.navigate(['/cart']);
  }

  close() {
    this.drawerService.close();
  }
}
