import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  /**
   * Upload single image to server
   * @param file - The image file
   * @param filename - The filename to save as (should be the book name)
   * @returns Observable with upload response
   */
  uploadImage(file: File, filename: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    return this.http.post(`${this.apiUrl}/upload-image`, formData);
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

    return this.http.post(`${this.apiUrl}/upload-images`, formData);
  }
}
