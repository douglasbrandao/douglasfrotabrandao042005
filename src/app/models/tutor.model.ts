import type { Pet, PetFoto  } from './pet.model';

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: PetFoto;
  pets?: Pet[];
}

export interface TutorFilterParams {
  nome?: string;
  email?: string;
  page?: number;
  size?: number;
}

export interface TutorListResponse {
  content: Tutor[];
  total: number;
  page: number;
  size: number;
  pageCount: number;
}
