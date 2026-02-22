import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Branch {
  name: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {
  http = inject(HttpClient);
  
  branches: Branch[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    this.loadBranches();
  }

  loadBranches() {
    this.http.get<any>('/assets/config/generalData.json').subscribe({
      next: (data) => {
        this.branches = data.branches || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading branches:', err);
        this.errorMessage = 'שגיאה בטעינת נתוני הסניפים';
        this.isLoading = false;
      }
    });
  }

  callBranch(phone: string) {
    // ניסיון לפתוח את יישום הטלפון
    window.location.href = `tel:${phone}`;
  }
}
