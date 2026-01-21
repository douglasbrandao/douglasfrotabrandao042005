import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TutorService } from './tutor.service';
import { Tutor, TutorListResponse } from '../models/pet.model';

describe('TutorService', () => {
  let service: TutorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), TutorService]
    });

    service = TestBed.inject(TutorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('serviço deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('list deve enviar params e retornar lista', () => {
    const mock: TutorListResponse = {
      content: [{ id: 1, nome: 'Joao', email: 'j@e', telefone: '111', endereco: 'rua', cpf: 123 } as Tutor],
      total: 1,
      page: 0,
      size: 10,
      pageCount: 1
    };

    service.list({ nome: 'Joao', page: 0, size: 10 }).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('nome')).toBe('Joao');
    req.flush(mock);
  });

  it('getById deve buscar tutor por id', () => {
    const mock: Tutor = { id: 2, nome: 'Maria', email: 'm@e', telefone: '222', endereco: 'avenida', cpf: 456 } as Tutor;

    service.getById(2).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores/2'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create deve enviar POST e retornar tutor criado', () => {
    const payload: Partial<Tutor> = { nome: 'Carlos', email: 'c@e' };
    const mock: Tutor = { id: 3, nome: 'Carlos', email: 'c@e', telefone: '', endereco: '', cpf: 0 } as Tutor;

    service.create(payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('update deve enviar PUT para o id correto', () => {
    const payload: Partial<Tutor> = { nome: 'Carlin' };
    const mock: Tutor = { id: 3, nome: 'Carlin', email: 'c@e', telefone: '', endereco: '', cpf: 0 } as Tutor;

    service.update(3, payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores/3'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('uploadPhoto deve enviar FormData no endpoint de fotos', () => {
    const file = new File(['b'], 'b.png', { type: 'image/png' });
    const mock: Tutor = { id: 4, nome: 'FotoTutor', email: 'f@e', telefone: '', endereco: '', cpf: 0 } as Tutor;

    service.uploadPhoto(4, file).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores/4/fotos'));
    expect(req.request.method).toBe('POST');
    const body = req.request.body as FormData;
    expect(body.get('foto')).toBeTruthy();
    req.flush(mock);
  });

  it('linkPet deve fazer POST para vincular pet', () => {
    service.linkPet(5, 10).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores/5/pets/10'));
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('unlinkPet deve fazer DELETE para desvincular pet', () => {
    service.unlinkPet(5, 10).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/tutores/5/pets/10'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
