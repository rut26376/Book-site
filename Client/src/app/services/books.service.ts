import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  book_URL = '/books';
  http = inject(HttpClient);
  books$ = this.getAllBooks();
  bookLst: Book[] = [];
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.book_URL}/getAll`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.book_URL}/newBook`, book);
  }
}
