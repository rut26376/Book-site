import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  searchBooks: Book[] = [];
  searchQuery: string = '';

  search(query: string) {
    if (!query || query.trim() === '') {
      this.searchBooks = [];
      console.log('חיפוש ריק - הסתרת תוצאות');
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.searchBooks = this.bookService.bookLst.filter(book =>
      book.bookName.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery)
    );
    console.log('תוצאות חיפוש:', this.searchBooks);
  }

  closeDropdown() {
    this.searchBooks = [];
    this.searchQuery = '';
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
    "../data/books-img/בובה.png"
    console.log('קטגוריות:', this.categories);

    // טעינת הספרים
    this.bookService.books$.subscribe(books => {
      this.bookService.bookLst = books;
      console.log(this.bookService.bookLst);
    });
  }
}
