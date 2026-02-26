import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  //private apiUrl = 'http://localhost:5000';
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  /**
   * Get the full URL for an image
   * Works both in development and production
   */
  getImageUrl(filename: string): string {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      // מקומית: השתמש ב-localhost:5000
      return `${this.apiUrl}/assets/book-img/${filename}`;
    } else {
      // בענן: השתמש בדומיין הנוכחי
      return `/assets/book-img/${filename}`;
    }
  }

  /**
   * Upload single image to server
   * @param file - The image file
   * @param filename - The filename to save as (should be the book name)
   * @returns Observable with upload response
   */
  uploadImage(file: File, filename: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // שלח את השם בURL כדי להימנע מבעיות encoding
    const encodedFilename = encodeURIComponent(filename);
    
    // השתמש בנתיב יחסי בענן ובנתיב מלא מקומית
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const uploadEndpoint = isLocalhost ? `${this.apiUrl}/upload-image` : '/upload-image';
    
    return this.http.post(`${uploadEndpoint}?filename=${encodedFilename}`, formData);
  }

  /**
   * Upload multiple images to server
   * @param files - Array of image files
   * @returns Observable with upload response
   */
  uploadMultipleImages(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const uploadEndpoint = isLocalhost ? `${this.apiUrl}/upload-images` : '/upload-images';
    
    return this.http.post(uploadEndpoint, formData);
  }
}
