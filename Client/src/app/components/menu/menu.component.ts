import { Component, inject, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { AuthService } from '../../services/auth.service';
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
  searchBooks: Book[] = [];
  searchQuery: string = '';
  drawerService = inject(CartDrawerService);
  currentUser: Customer | null = null;
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
    
    if (searchBox && !searchBox.contains(target) && 
        dropdown && !dropdown.contains(target)) {
      this.closeDropdown();
    }
  }

  ngOnInit() {
    // טעינת הקטגוריות מה-JSON
    this.categories = categoriesData.categories;

    // טעינת הספרים
    this.bookService.books$.subscribe(books => {
      this.bookService.bookLst = books;
    });

    // מעקב אחר המשתמש המחובר
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
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
}
