import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class FileSend {
  private http = inject(HttpClient);
  private apiUrl = '/api/groups';

  sendFile(file: File) {
    return this.http.post<string>(this.apiUrl + '/upload', file, {responseType: 'text'});
  }
}
