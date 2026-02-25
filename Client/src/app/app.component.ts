import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, CartDrawerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  title = 'Client';
  isAdminPage = false;

  ngOnInit() {
    // מעקב אחר שינויי הנתיב
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminPage = event.url.includes('/admin');
      });
  }
}
