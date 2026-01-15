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
    sessionStorage.removeItem('tokenExpiration');
    sessionStorage.removeItem('refreshTokenExpiration');
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isTokenExpiring(): boolean {
    const expirationTime = sessionStorage.getItem('tokenExpiration');

    if (!expirationTime) return true;
    
    const expiresAt = parseInt(expirationTime);
    const now = Date.now();

    // 30 segundos antes de expirar
    const bufferTime = 30000;
    
    return now >= (expiresAt - bufferTime);
  }

  isRefreshTokenValid(): boolean {
    const refreshExpiration = sessionStorage.getItem('refreshTokenExpiration');

    if (!refreshExpiration) return false;
    
    const expiresAt = parseInt(refreshExpiration);
    return Date.now() < expiresAt;
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  private setTokens(response: AuthResponse): void {
    sessionStorage.setItem('accessToken', response.access_token);
    sessionStorage.setItem('refreshToken', response.refresh_token);
    this.token.set(response.access_token);
    
    const expirationTime = Date.now() + (response.expires_in * 1000);
    sessionStorage.setItem('tokenExpiration', expirationTime.toString());
    
    const refreshExpirationTime = Date.now() + (response.refresh_expires_in * 1000);
    sessionStorage.setItem('refreshTokenExpiration', refreshExpirationTime.toString());
  }
}
