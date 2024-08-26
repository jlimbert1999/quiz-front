import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http = inject(HttpClient);
  constructor() {}

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ file: string }>(
      `${environment.base_url}/files/question`,
      formData
    );
  }
}
