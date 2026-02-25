import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BooksService } from '../../services/books.service';
import { OrderService } from '../../services/order.service';
import { UploadService } from '../../services/upload.service';
import { BooksComponent } from './books/books.component';
import categoriesData from '../../data/categories.json';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, BooksComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private authService = inject(AuthService);
  private booksService = inject(BooksService);
  private orderService = inject(OrderService);
  private uploadService = inject(UploadService);
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

  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
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

    // שמור את הקובץ בComponent לשימוש מאוחר
    (this.newBook as any).imageFile = file;
    
    // הצג preview של התמונה
    const reader = new FileReader();
    reader.onload = (e: any) => {
      (this.newBook as any).imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    console.log('📸 Image selected:', file.name);
    alert('תמונה נבחרה. היא תשמר כשתשמור את הספר.');
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

    // אם בחרו תמונה, העלה אותה לשרבר עכשיו
    if ((this.newBook as any).imageFile) {
      const imageFile = (this.newBook as any).imageFile;
      
      // יצור שם קובץ על פי שם הספר
      const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      
      // נקה את שם הספר - הסר תווים שאינם תקינים בשמות קבצים
      let cleanBookName = this.newBook.bookName
        .trim()
        .replace(/[\s]+/g, '_')  // החלף רווחים בקו תחתי
        .replace(/[\/\\:*?"<>|]/g, '')  // הסר תווים אסורים בשמות קבצים
        .substring(0, 100);  // הגבל ל-100 תווים
      
      const pictureFilename = `${cleanBookName}.${fileExtension}`;

      // העלה את התמונה לשרבר עם השם החדש
      this.uploadService.uploadImage(imageFile, pictureFilename).subscribe({
        next: (response: any) => {
          console.log('✅ Image uploaded with filename:', pictureFilename);
          // אחרי שהתמונה נשמרה בהצלחה, שמור את הספר בDB
          this.saveBookToDatabase(pictureFilename);
        },
        error: (err: any) => {
          console.error('❌ Image upload error:', err);
          alert('שגיאה בהעלאת התמונה');
        }
      });
    } else {
      // אם לא בחרו תמונה, שמור את הספר בלי תמונה
      this.saveBookToDatabase('');
    }
  }

  /**
   * שמור את הספר בDB עם שם התמונה
   */
  private saveBookToDatabase(pictureFilename: string) {
    const bookWithId: any = {
      id: Date.now(), // השתמש בtimestamp כ-ID ייחודי
      bookName: this.newBook.bookName,
      author: this.newBook.author,
      description: this.newBook.description,
      price: this.newBook.price,
      size: this.newBook.size,
      picture: pictureFilename,  // ← שם הקובץ (כשם הספר)
      category: this.newBook.category
    };

    this.booksService.addBook(bookWithId).subscribe({
      next: (response: any) => {
        alert('הספר נוסף בהצלחה!');
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
    (this.newBook as any).imageFile = null;
    (this.newBook as any).imagePreview = null;
    this.selectedMainCategory = '';
    this.selectedSubCategories = [];
    this.availableSubCategories = [];
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
