import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PetService } from './pet.service';
import { Pet, PetListResponse } from '../models/pet.model';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), PetService]
    });

    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('serviço deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('list deve enviar params e retornar lista', () => {
    const mock: PetListResponse = {
      content: [{ id: 1, nome: 'Fido', raca: 'Pug', idade: 3 } as Pet],
      total: 1,
      page: 0,
      size: 10,
      pageCount: 1
    };

    service.list({ nome: 'Fido', raca: 'Pug', page: 0, size: 10 }).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/pets'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('nome')).toBe('Fido');
    expect(req.request.params.get('raca')).toBe('Pug');
    req.flush(mock);
  });

  it('getById deve buscar pet por id', () => {
    const mock: Pet = { id: 2, nome: 'Luna', raca: 'SRD', idade: 2 } as Pet;

    service.getById(2).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/v1/pets/2'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create deve enviar POST e retornar pet criado', () => {
    const payload: Partial<Pet> = { nome: 'Bolt', raca: 'Beagle' };
    const mock: Pet = { id: 3, nome: 'Bolt', raca: 'Beagle', idade: 1 } as Pet;

    service.create(payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/pets'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('update deve enviar PUT para o id correto', () => {
    const payload: Partial<Pet> = { nome: 'Boltito' };
    const mock: Pet = { id: 3, nome: 'Boltito', raca: 'Beagle', idade: 1 } as Pet;

    service.update(3, payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/pets/3'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('delete deve enviar DELETE para o id correto', () => {
    service.delete(4).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/pets/4'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('uploadPhoto deve enviar FormData no endpoint de fotos', () => {
    const file = new File(['a'], 'a.png', { type: 'image/png' });
    const mock: Pet = { id: 5, nome: 'FotoPet', raca: 'SRD', idade: 2 } as Pet;

    service.uploadPhoto(5, file).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(r => r.url.endsWith('/v1/pets/5/fotos'));
    expect(req.request.method).toBe('POST');
    const body = req.request.body as FormData;
    expect(body.get('foto')).toBeTruthy();
    req.flush(mock);
  });
});
