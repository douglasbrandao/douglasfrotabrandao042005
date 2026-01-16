import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tutor } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/tutores`;

  getById(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`);
  }
}
