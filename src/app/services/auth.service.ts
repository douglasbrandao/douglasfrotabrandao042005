import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  public token = signal<string | null>(this.getToken());

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/autenticacao/login`, credentials)
      .pipe(
        tap(response => this.setTokens(response))
      );
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.put<AuthResponse>(`${environment.apiUrl}/autenticacao/refresh`, { refreshToken })
      .pipe(
        tap(response => this.setTokens(response))
      );
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  private setTokens(response: AuthResponse): void {
    sessionStorage.setItem('accessToken', response.accessToken);
    sessionStorage.setItem('refreshToken', response.refreshToken);
    this.token.set(response.accessToken);
  }
}
