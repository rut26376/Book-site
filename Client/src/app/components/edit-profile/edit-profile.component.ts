import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fetchIsraelCities } from '../../data/index';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);

  currentUser: Customer | null = null;
  editedUser: Customer = {} as Customer;
  isSaving: boolean = false;
  
  // משתנים לניהול רשימת הערים
  cities: string[] = [];
  filteredCities: string[] = [];
  citySearchTerm: string = '';
  showCityDropdown: boolean = false;
  
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.editedUser = { ...user };
        }
      });

    // טעינת רשימת הערים
    fetchIsraelCities(this.http).then((cities: string[]) => {
      this.cities = cities;
      this.filteredCities = cities;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveChanges() {
    if (!this.editedUser) return;

    // בדיקה בסיסית
    if (!this.editedUser.fullName || !this.editedUser.email || !this.editedUser.phone) {
      alert('אנא מלא את כל השדות הנדרשים');
      return;
    }

    this.isSaving = true;

    // שלח את העדכון לשרת
    this.authService.updateUserProfile(this.editedUser).subscribe({
      next: (response) => {
        this.isSaving = false;
        alert('הפרטים עודכנו בהצלחה!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error updating profile:', err);
        alert('שגיאה בעדכון הפרטים: ' + (err.error?.message || 'נסה שוב מאוחר יותר'));
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  // ניהול דרופדאון של הערים
  toggleCityDropdown() {
    this.showCityDropdown = !this.showCityDropdown;
    if (this.showCityDropdown) {
      this.citySearchTerm = '';
      this.filteredCities = this.cities;
    }
  }

  filterCities() {
    const searchTerm = this.citySearchTerm.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredCities = this.cities;
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.toLowerCase().includes(searchTerm)
      );
    }
  }

  selectCity(city: string) {
    this.editedUser.city = city;
    this.showCityDropdown = false;
    this.citySearchTerm = '';
    this.filteredCities = this.cities;
  }

  closeCityDropdown() {
    this.showCityDropdown = false;
  }
}
