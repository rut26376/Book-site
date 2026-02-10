import { Routes } from '@angular/router';
import { DisplayBookComponent } from './components/display-book/display-book.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: DisplayBookComponent },
    { path: 'book/:id', component: DisplayBookComponent },
];
