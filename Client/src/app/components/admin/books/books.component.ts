import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../services/books.service';
import { UploadService } from '../../../services/upload.service';
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
  private uploadService = inject(UploadService);

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
  
  // עריכה
  isEditMode: boolean = false;
  editingBook: any = null;
  selectedImageFile: File | null = null;
  newImagePreview: string | null = null;

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
   * קבל URL של תמונה - עובד הן מקומית והן בענן
   */
  getImageUrl(filename: string): string {
    return this.uploadService.getImageUrl(filename);
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
    this.isEditMode = true;
    // עיתוי עמוק כדי לא לפגוע בנתונים המקוריים
    this.editingBook = JSON.parse(JSON.stringify(book));
    this.editingBook.showImageOptions = false; // לא להציג את הדרופדאון בהתחלה
    this.selectedImageFile = null;
    this.newImagePreview = null;
  }

  /**
   * החלף את תצוגת אפשרויות התמונה
   */
  toggleImageOptions() {
    if (this.editingBook) {
      this.editingBook.showImageOptions = !this.editingBook.showImageOptions;
    }
  }

  /**
   * בחר תמונה חדשה לעריכה
   */
  onImageSelectedForEdit(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedImageFile = file;

    // הצג תצוגה מקדימה
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * הסר את התמונה החדשה
   */
  removeNewImage() {
    this.selectedImageFile = null;
    this.newImagePreview = null;
  }

  /**
   * ביטול עריכה
   */
  cancelEdit() {
    this.isEditMode = false;
    this.editingBook = null;
  }

  /**
   * שמור שינויים בספר
   */
  saveEdit() {
    if (!this.editingBook || !this.editingBook.id) {
      alert('שגיאה: לא נמצא מזהה הספר');
      return;
    }

    // אם בחרנו תמונה חדשה, צריך להעלות אותה קודם
    if (this.selectedImageFile) {
      // גנרה שם קובץ חדש (כמו בהוספה)
      const fileExtension = this.selectedImageFile.name.split('.').pop();
      const cleanBookName = this.editingBook.bookName
        .trim()
        .replace(/[\s]+/g, '_')
        .replace(/[\/\\:*?"<>|]/g, '')
        .substring(0, 100);
      const newFilename = `${cleanBookName}.${fileExtension}`;

      // העלה את התמונה החדשה
      const uploadService = this.uploadService;
      uploadService.uploadImage(this.selectedImageFile, newFilename).subscribe({
        next: (response: any) => {
          // עדכן את שם התמונה בספר
          this.editingBook.picture = newFilename;

          // מחק את התמונה הישנה אם יש
          if (this.editingBook.picture) {
            this.booksService.deleteImage(this.editingBook.picture).subscribe({
              next: () => {
                console.log(`✅ תמונה ישנה נמחקה: ${this.editingBook.picture}`);
              },
              error: (err: any) => {
                console.error(`⚠️ שגיאה במחיקת התמונה הישנה:`, err);
              }
            });
          }

          // עכשיו שמור את הספר עם התמונה החדשה
          this.performSaveEdit();
        },
        error: (err: any) => {
          alert('שגיאה בהעלאת התמונה: ' + (err.error?.error || 'בדוק את ה-console'));
        }
      });
    } else {
      // אין תמונה חדשה, פשוט שמור את הנתונים
      this.performSaveEdit();
    }
  }

  /**
   * בצע את שמירת הנתונים
   */
  private performSaveEdit() {
    this.booksService.editBook(this.editingBook.id, this.editingBook).subscribe({
      next: (response: any) => {
        alert('הספר עודכן בהצלחה!');
        this.cancelEdit();
        // רענן את הדף כדי לוודא שהתמונה החדשה טוענת
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: (err: any) => {
        alert('שגיאה בעדכון הספר: ' + (err.error?.error || err.error?.message || 'בדוק את ה-console'));
      }
    });
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
