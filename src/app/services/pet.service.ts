import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pet, PetListResponse, PetFilterParams } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/pets`;

  list(filters: PetFilterParams = {}): Observable<PetListResponse> {
    let params = new HttpParams()
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 10).toString());
    
    if (filters.nome) {
      params = params.set('nome', filters.nome);
    }
    
    if (filters.raca) {
      params = params.set('raca', filters.raca);
    }
    
    return this.http.get<PetListResponse>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
