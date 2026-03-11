import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // אם קיבלנו 401 Unauthorized - הטוקן פג או לא תקף
        if (error.status === 401) {
          console.warn('🔐 הטוקן לא תקף או פג - ביצוע התנתקות');
          
          // התנתק מהמערכת עם הודעה
         this.authService.logoutWithMessage('🔐 ההתחברות שלך פגה. אנא התחבר שוב.');
          
          // נווט לעמוד ההתחברות
          this.router.navigate(['/auth']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
