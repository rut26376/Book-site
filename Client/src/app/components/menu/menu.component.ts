import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import categoriesData from '../../data/categories.json';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  categories: any[] = [];
  bookService = inject(BooksService);
  router = inject(Router);
  searchBooks: Book[] = [];
  searchQuery: string = '';

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
  }
}
