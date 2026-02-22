import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  currentUser: Customer | null = null;
  showDropdown: boolean = false;
  
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Close dropdown/modal when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userProfileContainer = document.querySelector('.user-profile-container');
    
    // אם הלחיצה היא מחוץ לuser-profile-container, סגור הכל
    if (userProfileContainer && !userProfileContainer.contains(target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  startEditing() {
    if (this.currentUser) {
      this.showDropdown = false;
      this.router.navigate(['/edit-profile']);
    }
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/']);
  }
}
