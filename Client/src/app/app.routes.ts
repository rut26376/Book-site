import { Routes } from '@angular/router';
import { DisplayBookComponent } from './components/display-book/display-book.component';
import { CategoryBookComponent } from './components/category-book/category-book.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: DisplayBookComponent },
    { path: 'book/:id', component: DisplayBookComponent },
    { path: 'category/:name', component: CategoryBookComponent},
    { path: 'cart', component: CartComponent },
];
