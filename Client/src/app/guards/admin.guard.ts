import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // בדוק אם המשתמש מחובר והוא admin
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }
    
    // אם לא admin, הפנה לדף הבית
    this.router.navigate(['/']);
    return false;
  }
}
