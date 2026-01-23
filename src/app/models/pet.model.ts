import type { Tutor } from './tutor.model';

export interface PetFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: PetFoto;
  tutores?: Tutor[];
}

export interface PetListResponse {
  content: Pet[];
  total: number;
  page: number;
  size: number;
  pageCount: number;
}

export interface PetFilterParams {
  nome?: string;
  raca?: string;
  page?: number;
  size?: number;
}
