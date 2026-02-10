import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-display-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-book.component.html',
  styleUrl: './display-book.component.css'
})
export class DisplayBookComponent implements OnInit {
  @ViewChild('bookImage') bookImage!: ElementRef;
  
  book: Book | null = null;
  bookService = inject(BooksService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  isLightboxOpen = false;

  ngOnInit() {
    // קבלת ה-ID מה-URL
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      if (bookId) {
        this.getBookById(bookId);
      }
    });
  }

  getBookById(id: string) {
    // חיפוש הספר בלisting של הספרים
    const foundBook = this.bookService.bookLst.find(b => b.id === parseInt(id));
    if (foundBook) {
      this.book = foundBook;
    } else {
      // אם לא נמצא, חזור לעמוד הבית
      this.router.navigate(['/']);
    }
  }

  goBack() {
    window.history.back();
  }

  addToCart() {
    if (this.book) {
      console.log('הוסף לסל:', this.book.bookName);
      // כאן תוסיפו את הלוגיקה להוספה לעגלה
    }
  }

  openLightbox() {
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  onImageMouseMove(event: MouseEvent) {
    const imageContainer = event.currentTarget as HTMLElement;
    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // חישוב מיקום ב-percentage
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // הגדרת transform-origin לפי מיקום העכבר
    imageContainer.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  }

  onImageMouseLeave(event: MouseEvent) {
    const imageContainer = event.currentTarget as HTMLElement;
    imageContainer.style.transformOrigin = 'center center';
  }
}
