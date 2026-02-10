import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-book.component.html',
  styleUrl: './category-book.component.css'
})
export class CategoryBookComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  bookService = inject(BooksService);
  
  categoryName: string = '';
  books: Book[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryName = params['name'];
      this.filterBooksByCategory();
    });
  }

  filterBooksByCategory() {
    this.books = this.bookService.bookLst.filter(book =>
      book.category && book.category.some(cat => cat.main === this.categoryName)
    );
  }

  viewBook(bookId: number) {
    this.router.navigate(['/book', bookId]);
  }

  goBack() {
    this.router.navigate(['/category', this.categoryName]);
  }
}
