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
