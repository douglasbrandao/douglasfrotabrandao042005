import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tutor, TutorListResponse, TutorFilterParams } from '../models/tutor.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/tutores`;

  getById(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.apiUrl}/${id}`);
  }

  list(params: TutorFilterParams = {}): Observable<TutorListResponse> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.nome) {
      httpParams = httpParams.set('nome', params.nome);
    }

    return this.http.get<TutorListResponse>(this.apiUrl, { params: httpParams });
  }

  update(id: number, data: Partial<Tutor>): Observable<Tutor> {
    return this.http.put<Tutor>(`${this.apiUrl}/${id}`, data);
  }

  create(data: Partial<Tutor>): Observable<Tutor> {
    return this.http.post<Tutor>(this.apiUrl, data);
  }

  uploadPhoto(id: number, file: File): Observable<Tutor> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<Tutor>(`${this.apiUrl}/${id}/fotos`, formData);
  }

  linkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${tutorId}/pets/${petId}`, {});
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tutorId}/pets/${petId}`);
  }
}
