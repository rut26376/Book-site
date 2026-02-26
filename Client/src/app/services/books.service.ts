import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  book_URL = '/books';
  //book_URL = 'http://localhost:5000/books';
  http = inject(HttpClient);
  authService = inject(AuthService);
  books$ = this.getAllBooks();
  bookLst: Book[] = [];
  
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.book_URL}/getAll`);
  }

  addBook(book: Book): Observable<Book> {
    // קבל את ה-token ויוסף ל-header
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.post<Book>(`${this.book_URL}/newBook`, book, { headers });
  }

  deleteBook(id: number): Observable<any> { 
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.delete(`${this.book_URL}/delete/${id}`, { headers });
  }

  editBook(id: number, updatedData: Partial<Book>): Observable<Book> {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put<Book>(`${this.book_URL}/edit/${id}`, updatedData, { headers });
  }

  deleteImage(filename: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete(`${this.book_URL}/delete-image/${filename}`, { headers });
  }
}