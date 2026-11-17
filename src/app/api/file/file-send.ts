import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class FileSend {
  private http = inject(HttpClient);
  private apiUrl = '/api/groups';

  sendFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(this.apiUrl, formData);
  }
}
