import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../services/books.service';
import categoriesData from '../../../data/categories.json';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  private booksService = inject(BooksService);

  books: any[] = [];
  allBooks: any[] = [];
  
  // סינון
  searchQuery: string = '';
  filterAuthor: string = '';
  filterCategory: string = '';
  
  // קטגוריות מ-JSON
  categories = categoriesData.categories;
  
  // תצוגת תמונה גדולה
  selectedImageBook: any = null;
  showImageModal: boolean = false;

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (response: any) => {
        this.allBooks = response;
        this.books = response;
      },
      error: (err: any) => console.error('Error loading books:', err)
    });
  }

  /**
   * סינון הספרים לפי חיפוש
   */
  filterBooks() {
    this.books = this.allBooks.filter(book => {
      const matchesSearch = !this.searchQuery || 
        book.bookName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesAuthor = !this.filterAuthor || 
        book.author.toLowerCase().includes(this.filterAuthor.toLowerCase());
      
      const matchesCategory = !this.filterCategory || 
        (book.category && book.category.some((cat: any) => 
          cat.main.includes(this.filterCategory) || 
          cat.sub.includes(this.filterCategory)
        ));
      
      return matchesSearch && matchesAuthor && matchesCategory;
    });
  }

  /**
   * פתח מודל להצגת התמונה בגדול
   */
  viewImage(book: any) {
    this.selectedImageBook = book;
    this.showImageModal = true;
  }

  /**
   * סגור מודל התמונה
   */
  closeImageModal() {
    this.showImageModal = false;
    this.selectedImageBook = null;
  }

  /**
   * מחק ספר
   */
  deleteBook(bookId: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק ספר זה?')) {
      this.booksService.deleteBook(bookId).subscribe({
        next: (response: any) => {
          alert('הספר נמחק בהצלחה!');
          this.loadBooks(); // Reload the books after deletion
        },
        error: (err: any) => {
          alert('שגיאה בחיקת הספר: ' + (err.error?.error || err.error?.message || 'בדוק את ה-console'));
        }
      });
    }
  }

  /**
   * עדכן ספר
   */
  editBook(book: any) {
    alert('עריכה טרם הטמעה');
  }

  /**
   * קבל רשימת המחברים הייחודיים
   */
  get uniqueAuthors(): string[] {
    const authors = new Set(this.allBooks.map(b => b.author));
    return Array.from(authors).sort();
  }

  /**
   * קבל רשימת הקטגוריות הייחודיות מה-JSON
   */
  get uniqueCategories(): string[] {
    const categories = new Set<string>();
    this.categories.forEach(mainCat => {
      categories.add(mainCat.main);
      if (mainCat.sub && Array.isArray(mainCat.sub)) {
        mainCat.sub.forEach(sub => categories.add(sub));
      }
    });
    return Array.from(categories).sort();
  }
}
