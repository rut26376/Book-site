import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-book.component.html',
  styleUrl: './category-book.component.css'
})
export class CategoryBookComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  bookService = inject(BooksService);
  cartService = inject(CartService);
  
  categoryName: string = '';
  books: Book[] = [];
  allBooks: Book[] = [];
  bookQuantities: { [key: number]: number } = {};
  subCategories: string[] = [];
  selectedSubCategory: string | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = params['name'];
      this.loadSubCategories();
      this.filterBooksByCategory();
    });
  }

  loadSubCategories() {
    // טעינת התת-קטגוריות מה-categories.json
    const categories = require('../../data/categories.json').categories;
    const mainCategory = categories.find((cat: any) => cat.main === this.categoryName);
    if (mainCategory) {
      this.subCategories = mainCategory.sub;
    }
  }

  filterBooksByCategory() {
    // סינון לפי הקטגוריה הראשית
    this.allBooks = this.bookService.bookLst.filter(book =>
      book.category && book.category.some(cat => cat.main === this.categoryName)
    );
    
    // אם יש בחירה בתת-קטגוריה, סנן עוד יותר
    if (this.selectedSubCategory) {
      this.books = this.allBooks.filter(book =>
        book.category && book.category.some(
          cat => cat.main === this.categoryName && cat.sub === this.selectedSubCategory
        )
      );
    } else {
      this.books = this.allBooks;
    }
  }

  selectSubCategory(subCategory: string | null) {
    this.selectedSubCategory = subCategory;
    this.filterBooksByCategory();
  }

  viewBook(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  addToCart(book: Book) {
    const quantity = this.bookQuantities[book.id] || 1;
    this.cartService.addToCart(book, quantity);
    alert(`הוסף לסל: ${book.bookName} - כמות: ${quantity}`);
    // אפשר להוסיף גם ניווט לסל
    // this.router.navigate(['/cart']);
  }

  increaseQuantity(bookId: number) {
    if (!this.bookQuantities[bookId]) {
      this.bookQuantities[bookId] = 1;
    }
    this.bookQuantities[bookId]++;
  }

  decreaseQuantity(bookId: number) {
    if (this.bookQuantities[bookId] && this.bookQuantities[bookId] > 1) {
      this.bookQuantities[bookId]--;
    }
  }

  getQuantity(bookId: number): number {
    return this.bookQuantities[bookId] || 1;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
