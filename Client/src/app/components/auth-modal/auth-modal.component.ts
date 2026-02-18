import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { fetchIsraelCities } from '../../data/index';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  
  isOpen = false;
  isLogin = true;
  isLoading = false;
  errorMessage = '';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm: Customer = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    houseNumber: ''
  };

  // משתנים לניהול רשימת הערים
  cities: string[] = [];
  filteredCities: string[] = [];
  citySearchTerm: string = '';
  showCityDropdown: boolean = false;

  ngOnInit() {
    // אם כבר מחובר - לא להציג את המודאל
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.closeModal();
      }
    });

    // טעינת רשימת הערים
    fetchIsraelCities(this.http).then((cities: string[]) => {
      this.cities = cities;
      this.filteredCities = cities;
    });
  }

  openModal(isLogin: boolean = true) {
    this.isOpen = true;
    this.isLogin = isLogin;
    this.errorMessage = '';
    this.resetForms();
  }

  closeModal() {
    this.isOpen = false;
    this.resetForms();
  }

  resetForms() {
    this.loginForm = { email: '', password: '' };
    this.registerForm = {
      id: 0,
      fullName: '',
      email: '',
      password: '',
      phone: '',
      street: '',
      city: '',
      houseNumber: ''
    };
    this.errorMessage = '';
    this.citySearchTerm = '';
    this.showCityDropdown = false;
  }

  switchMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  onLogin() {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'אנא מלא את כל השדות';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.closeModal();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'שגיאה בהתחברות. אנא נסה שוב.';
      }
    });
  }

  onRegister() {
    if (!this.registerForm.fullName || !this.registerForm.email || !this.registerForm.password) {
      this.errorMessage = 'אנא מלא את השדות החובה';
      return;
    }

    if (this.registerForm.password.length < 6) {
      this.errorMessage = 'הסיסמא חייבת להכיל לפחות 6 תווים';
      return;
    }

    // השרת יוצר ID אוטומטית - אין צורך ליצור בקליינט
    this.isLoading = true;
    this.authService.register(this.registerForm).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.closeModal();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'שגיאה בהרשמה. אנא נסה שוב.';
      }
    });
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
    this.registerForm.city = city;
    this.showCityDropdown = false;
    this.citySearchTerm = '';
    this.filteredCities = this.cities;
  }

  closeCityDropdown() {
    this.showCityDropdown = false;
  }
}
