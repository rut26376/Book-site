import { Component, inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BooksService } from '../../services/books.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import categoriesData from '../../data/categories.json';
import { Book } from '../../models/book.model';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  @ViewChild(AuthModalComponent) authModal!: AuthModalComponent;
  
  categories: any[] = [];
  bookService = inject(BooksService);
  router = inject(Router);
  authService = inject(AuthService);
  http = inject(HttpClient);
  searchBooks: Book[] = [];
  searchQuery: string = '';
  drawerService = inject(CartDrawerService);
  cartService = inject(CartService);
  currentUser: Customer | null = null;
  storePhone: string = '029999999';
  cartItemCount: number = 0;
  showUserDropdown: boolean = false;
  search(query: string) {
    if (!query || query.trim() === '') {
      this.searchBooks = [];
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.searchBooks = this.bookService.bookLst.filter(book =>
      book.bookName.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
  }

  closeDropdown() {
    this.searchBooks = [];
    this.searchQuery = '';
  }

  viewBook(book: Book) {
    // ניווט לעמוד הספר עם ה-ID
    this.router.navigate(['/book', book.id]);
    this.closeDropdown();
  }

  goToCart() {
    // this.router.navigate(['/cart']);
    this.drawerService.open();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const searchBox = document.querySelector('.search-box');
    const dropdown = document.querySelector('.search-results-dropdown');
    const userProfileWrapper = document.querySelector('.user-profile-wrapper');
    
    // סגור חיפוש אם לחיצה מחוץ
    if (searchBox && !searchBox.contains(target) && 
        dropdown && !dropdown.contains(target)) {
      this.closeDropdown();
    }

    // סגור dropdown של פרופיל אם לחיצה מחוץ
    if (userProfileWrapper && !userProfileWrapper.contains(target)) {
      this.closeUserDropdown();
    }
  }

  ngOnInit() {
    // טעינת הקטגוריות מה-JSON
    this.categories = categoriesData.categories;

    // טעינת מספר הטלפון מה-JSON
    this.http.get<any>('/assets/config/generalData.json').subscribe({
      next: (config) => {
        this.storePhone = config.store.phone;
      },
      error: (err) => {
        console.error('שגיאה בטעינת קובץ הקונפיגורציה:', err);
      }
    });

    // טעינת הספרים
    this.bookService.books$.subscribe(books => {
      this.bookService.bookLst = books;
    });

    // מעקב אחר המשתמש המחובר
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // מעקב אחר פריטים בעגלה
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    });
  }

  openLoginModal() {
    this.authModal.openModal(true);
  }

  openRegisterModal() {
    this.authModal.openModal(false);
  }

  logout() {
    this.authService.logout();
  }

  filterByCategory(category: string) {
    this.router.navigate(['/category', category]);
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }

  goToEditProfile() {
    this.showUserDropdown = false;
    this.router.navigate(['/edit-profile']);
  }

  logoutUser() {
    this.logout();
    this.showUserDropdown = false;
  }
}
