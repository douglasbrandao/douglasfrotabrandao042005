import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('serviço deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('login deve definir os tokens e signal', () => {
    const credentials = { username: 'user', password: 'pass' } as any;
    const mockResponse: AuthResponse = {
      access_token: 'access123',
      refresh_token: 'refresh123',
      expires_in: 3600,
      refresh_expires_in: 7200
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.token()).toBe('access123');
      expect(sessionStorage.getItem('accessToken')).toBe('access123');
      expect(sessionStorage.getItem('refreshToken')).toBe('refresh123');
      expect(sessionStorage.getItem('tokenExpiration')).toBeTruthy();
      expect(sessionStorage.getItem('refreshTokenExpiration')).toBeTruthy();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/autenticacao/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('logout deve limpar os tokens', () => {
    sessionStorage.setItem('accessToken', 'x');
    sessionStorage.setItem('refreshToken', 'y');
    sessionStorage.setItem('tokenExpiration', '1');
    sessionStorage.setItem('refreshTokenExpiration', '2');
    service.logout();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('refreshToken')).toBeNull();
    expect(service.token()).toBeNull();
  });

  it('refresh deve enviar refresh token no header e atualizar tokens', () => {
    sessionStorage.setItem('refreshToken', 'rtok');
    const mockResponse: AuthResponse = {
      access_token: 'newAccess',
      refresh_token: 'newRefresh',
      expires_in: 1000,
      refresh_expires_in: 2000
    };

    service.refresh().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.token()).toBe('newAccess');
      expect(sessionStorage.getItem('accessToken')).toBe('newAccess');
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/autenticacao/refresh'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer rtok');
    req.flush(mockResponse);
  });

  it('isAuthenticated deve refletir a presença de token', () => {
    sessionStorage.removeItem('accessToken');
    expect(service.isAuthenticated()).toBe(false);
    sessionStorage.setItem('accessToken','tok');
    expect(service.isAuthenticated()).toBe(true);
  });
});