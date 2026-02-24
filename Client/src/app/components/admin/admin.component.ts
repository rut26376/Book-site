import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BooksService } from '../../services/books.service';
import { OrderService } from '../../services/order.service';
import categoriesData from '../../data/categories.json';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private authService = inject(AuthService);
  private booksService = inject(BooksService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  currentUser = this.authService.getCurrentUser();
  activeTab: 'books' | 'orders' = 'books';
  
  // קטגוריות
  categories = categoriesData.categories;
  selectedMainCategory = '';
  selectedSubCategories: string[] = [];
  availableSubCategories: string[] = [];
  
  // For adding new book
  newBook = {
    bookName: '',
    author: '',
    description: '',
    price: 0,
    size: '',
    picture: '',
    category: [] as any[]
  };

  books: any[] = [];
  orders: any[] = [];
  allBooks: any[] = [];

  ngOnInit() {
    this.loadBooks();
    this.loadOrders();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (response: any) => {
        this.books = response;
        this.allBooks = response;
      },
      error: (err: any) => console.error('Error loading books:', err)
    });
  }

  loadOrders() {
    console.log('Loading orders...');
  }

  // בחירת קטגוריה ראשית
  onMainCategoryChange() {
    this.selectedSubCategories = [];
    const selected = this.categories.find(c => c.main === this.selectedMainCategory);
    this.availableSubCategories = selected?.sub || [];
  }

  // הוסף קטגוריה משנית
  addSubCategory(subCategory: string) {
    if (!this.selectedSubCategories.includes(subCategory)) {
      this.selectedSubCategories.push(subCategory);
      this.newBook.category.push({
        main: this.selectedMainCategory,
        sub: subCategory
      });
    }
  }

  // הסר קטגוריה משנית
  removeSubCategory(subCategory: string) {
    this.selectedSubCategories = this.selectedSubCategories.filter(s => s !== subCategory);
    this.newBook.category = this.newBook.category.filter(
      c => !(c.main === this.selectedMainCategory && c.sub === subCategory)
    );
  }

  // טיפול בבחירת תמונה
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (!file) {
      return;
    }

    // בדוק את סוג הקובץ
    if (!file.type.startsWith('image/')) {
      alert('אנא בחר תמונה בלבד');
      return;
    }

    // בדוק את גודל הקובץ (מקסימום 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('קובץ גדול מדי. גודל מקסימום: 5MB');
      return;
    }

    // קרא את הקובץ כData URL
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // קבל את סיומת הקובץ (jpg, png וכו')
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      
      // שמור את שם הקובץ על פי שם הספר
      // אם אין שם ספר עדיין, השתמש בשם המקורי
      let filename: string;
      
      if (this.newBook.bookName && this.newBook.bookName.trim()) {
        // טהר את שם הספר (הסר תווים מיוחדים)
        const cleanBookName = this.newBook.bookName
          .trim()
          .replace(/[^a-zA-Z0-9\u0590-\u05FF\s-]/g, '') // הסר תווים מיוחדים
          .replace(/\s+/g, '_') // החלף רווחים בקו תחתון
          .substring(0, 50); // הגבל לאורך מקסימום
        
        filename = `${cleanBookName}.${fileExtension}`;
      } else {
        // אם אין שם ספר, השתמש בשם המקורי עם timestamp
        const timestamp = Date.now();
        filename = `${timestamp}_${file.name}`;
      }
      
      // שמור את שם הקובץ בלבד (לא את כל ה-URL)
      this.newBook.picture = filename;
      
      console.log('📸 Image selected:', {
        originalName: file.name,
        savedName: filename,
        bookName: this.newBook.bookName,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  }

  addNewBook() {
    if (!this.newBook.bookName || !this.newBook.author || !this.newBook.price) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    if (this.newBook.category.length === 0) {
      alert('אנא בחר לפחות קטגוריה אחת');
      return;
    }

    // אם בחרו תמונה, עדכן את שם הקובץ על פי שם הספר
    let pictureFilename = this.newBook.picture;
    if (this.newBook.picture) {
      const fileExtension = this.newBook.picture.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBookName = this.newBook.bookName
        .trim()
        .replace(/[^a-zA-Z0-9\u0590-\u05FF\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      
      pictureFilename = `${cleanBookName}.${fileExtension}`;
    }

    // הוסף ID (השרת יוכל לעדכן אם צריך)
    const bookWithId: any = {
      id: Math.max(...this.books.map(b => b.id || 0), 0) + 1,
      bookName: this.newBook.bookName,
      author: this.newBook.author,
      description: this.newBook.description,
      price: this.newBook.price,
      size: this.newBook.size,
      picture: pictureFilename, // ← השתמש בשם המעודכן
      category: this.newBook.category
    };

    this.booksService.addBook(bookWithId).subscribe({
      next: (response: any) => {
        alert('הספר נוסף בהצלחה!');
        this.loadBooks();
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error adding book:', err);
        alert('שגיאה בהוספת הספר');
      }
    });
  }

  deleteBook(bookId: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק ספר זה?')) {
      // נוסיף את הפונקציה הזו ל-BooksService אחר כך
      alert('מחיקה טרם הטמעה');
    }
  }

  resetForm() {
    this.newBook = {
      bookName: '',
      author: '',
      description: '',
      price: 0,
      size: '',
      picture: '',
      category: []
    };
    this.selectedMainCategory = '';
    this.selectedSubCategories = [];
    this.availableSubCategories = [];
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
