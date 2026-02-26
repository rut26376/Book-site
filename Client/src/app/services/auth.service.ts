import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<Customer | null>(null);
  currentUser$ = this.currentUser.asObservable();
  private http = inject(HttpClient);
  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();

  private apiUrl = '/auth';
 // private apiUrl = 'http://localhost:5000/auth';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof localStorage === 'undefined') return;
    
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('current_user');
    
    if (savedToken) {
      this.token.next(savedToken);
    }
    if (savedUser) {
      try {
        this.currentUser.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user from storage', e);
      }
    }
  }

  private saveToStorage(token: string, user: Customer) {
    if (typeof localStorage === 'undefined') return;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  register(customer: Customer): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/register`, customer).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.currentUser.next(response.user);
            this.token.next(response.token);
            this.saveToStorage(response.token, response.user);
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login`, { email, password }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.currentUser.next(response.user);
            this.token.next(response.token);
            this.saveToStorage(response.token, response.user);
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
    this.currentUser.next(null);
    this.token.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  getCurrentUser(): Customer | null {
    return this.currentUser.value;
  }

  updateCurrentUser(user: Customer) {
    this.currentUser.next(user);
    this.saveToStorage(this.token.value || '', user);
  }

  updateUserProfile(user: Customer): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/update-profile`, user).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.currentUser.next(response.user);
            this.saveToStorage(this.token.value || '', response.user);
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  getToken(): string | null {
    return this.token.value;
  }

  getNextCustomerId(): Observable<any> {
    return this.http.get(`${this.apiUrl}/next-id`);
  }
}
