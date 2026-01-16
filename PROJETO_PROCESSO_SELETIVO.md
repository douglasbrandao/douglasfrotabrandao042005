# Projeto Processo Seletivo - Pet Manager

## 📋 Contexto
Desenvolvimento de uma SPA (Single Page Application) em **Angular** para o Estado de Mato Grosso que oferece um registro público de Pets e seus tutores através de uma API pública.

**API Base**: https://pet-manager-api.geia.vip/  
**Swagger**: https://pet-manager-api.geia.vip/q/swagger-ui/

## 🎯 Objetivo
Avaliar a capacidade de cadastrar, editar, excluir e apresentar dados fornecidos pela API, demonstrando boas práticas de desenvolvimento front-end com Angular.

## 🛠 Stack Tecnológica

### Obrigatório
- **Framework**: Angular (v21)
- **Linguagem**: TypeScript (nativo do Angular)
- **CSS Framework**: Tailwind CSS
- **HTTP Client**: HttpClient (nativo do Angular)
- **Containerização**: Docker

### Ferramentas Angular
- **Roteamento**: Angular Router com Lazy Loading
- **Estado Global**: RxJS com BehaviorSubject e Services
- **Formulários**: Reactive Forms (Angular Forms)
- **Testes**: Jasmine + Karma (padrão Angular)
- **Validação**: Validators nativos + Custom Validators
- **Requisições HTTP**: HttpClient + Interceptors
- **Padrão Arquitetural**: Facade Pattern + Services

## 📐 Arquitetura Angular

### Estrutura de Pastas Sugerida
```
src/
├── app/
│   ├── core/                  # Módulo Core (singleton services)
│   │   ├── services/          # Serviços globais
│   │   ├── guards/            # Route Guards
│   │   ├── interceptors/      # HTTP Interceptors
│   │   └── models/            # Interfaces e Types
│   ├── shared/                # Módulo Shared (componentes reutilizáveis)
│   │   ├── components/        # Componentes compartilhados
│   │   ├── directives/        # Diretivas customizadas
│   │   └── pipes/             # Pipes customizados
│   ├── features/              # Módulos de funcionalidades (Lazy Loaded)
│   │   ├── pets/              # Módulo de Pets
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── pets.module.ts
│   │   ├── tutores/           # Módulo de Tutores
│   │   └── auth/              # Módulo de Autenticação
│   └── app.component.ts
├── assets/                    # Recursos estáticos
└── environments/              # Configurações de ambiente
```

### Padrões de Arquitetura Angular (Sênior)
- **Facade Pattern**: Services que abstraem lógica complexa e comunicação com API
- **BehaviorSubject**: Gerenciamento de estado reativo com RxJS
- **Smart vs Presentational Components**: Separação clara de responsabilidades
- **Dependency Injection**: Uso adequado do sistema DI do Angular
- **Lazy Loading Modules**: Carregamento sob demanda de módulos
- **HTTP Interceptors**: Para autenticação e tratamento global de erros

## 🔐 Autenticação

### Endpoints
- **Login**: `POST /autenticacao/login`
- **Refresh Token**: `PUT /autenticacao/refresh`

### Implementação
- Interceptor para adicionar token nas requisições
- Gerenciamento de expiração do token
- Redirecionamento automático para login quando não autenticado
- Armazenamento seguro do token (sessionStorage ou localStorage)

## 📱 Funcionalidades

### 1. Tela Inicial - Listagem de Pets
**Endpoint**: `GET /v1/pets`

**Requisitos**:
- Exibir pets em cards com:
  - Foto (se existir)
  - Nome
  - Espécie
  - Idade
- Paginação (10 pets por página)
- Busca por nome para filtrar
- Lazy Loading da rota

**Componentes**:
- `PetList` (página)
- `PetCard` (componente)
- `SearchBar` (componente)
- `Pagination` (componente)

### 2. Tela de Detalhamento do Pet
**Endpoints**: 
- `GET /v1/pets/{id}`
- `GET /v1/tutores/{id}` (se houver tutor)

**Requisitos**:
- Acessível ao clicar no card
- Destacar nome do pet
- Exibir dados do tutor (nome e contato) se existir vínculo
- Mostrar todas as informações do pet

**Componentes**:
- `PetDetail` (página)
- `TutorInfo` (componente)

### 3. Tela de Cadastro/Edição de Pet
**Endpoints**:
- `POST /v1/pets` (criar)
- `PUT /v1/pets/{id}` (editar)
- `POST /v1/pets/{id}/fotos` (upload de foto)

**Requisitos**:
- Formulário com validação
- Campos: nome, espécie, idade, raça
- Upload de foto
- Máscaras quando necessário
- Feedback visual de sucesso/erro

**Componentes**:
- `PetForm` (página/componente)
- `ImageUpload` (componente)

### 4. Tela de Cadastro/Edição de Tutor
**Endpoints**:
- `POST /v1/tutores` (criar)
- `PUT /v1/tutores/{id}` (editar)
- `POST /v1/tutores/{id}/fotos` (upload de foto)
- `POST /v1/tutores/{id}/pets/{petId}` (vincular pet)
- `DELETE /v1/tutores/{id}/pets/{petId}` (desvincular pet)

**Requisitos**:
- Formulário com validação
- Campos: nome completo, telefone, endereço
- Upload de foto
- Listar pets vinculados
- Vincular/desvincular pets

**Componentes**:
- `TutorForm` (página/componente)
- `LinkedPets` (componente)
- `PetLinkManager` (componente)

## 🎨 Design e UX

### Responsividade
- Mobile-first approach
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Layout adaptável para todos os dispositivos

### Acessibilidade
- Semântica HTML adequada
- Labels em formulários
- Mensagens de erro claras
- Navegação por teclado

## 🧪 Testes Angular

### Requisitos Básicos
- Testes unitários para componentes principais
- Testes de serviços
- Testes de interação do usuário
- Uso de TestBed para configuração

### Requisitos Sênior
- Cobertura mínima de 70%
- Testes de componentes isolados e integrados
- Testes de services e facades
- Testes de guards e interceptors
- Mocks de HttpClient com HttpClientTestingModule

### Ferramentas Angular
- **Jasmine**: Framework de testes (padrão Angular)
- **Karma**: Test runner (padrão Angular)
- **TestBed**: Configuração de ambiente de testes
- **HttpClientTestingModule**: Mock de requisições HTTP
- **DebugElement**: Manipulação de DOM nos testes

### Comandos
```bash
ng test                    # Executar testes
ng test --code-coverage    # Executar com cobertura
```

## 📦 Containerização

### Docker
- Dockerfile otimizado com multi-stage build
- Imagem baseada em nginx para servir build de produção
- docker-compose.yml para facilitar execução local
- .dockerignore configurado

### Exemplo de Estrutura Angular
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/pet-manager /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf para SPA Angular
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 🚀 Performance Angular

### Otimizações
- **Lazy Loading**: Módulos carregados sob demanda
- **OnPush Change Detection**: Para componentes presentacionais
- **TrackBy**: Em *ngFor para melhor performance
- **Async Pipe**: Para gerenciar subscriptions automaticamente
- **Debounce**: Em buscas com RxJS operators (debounceTime)
- **Code Splitting**: Automático com lazy loading de módulos
- **Paginação**: Implementação eficiente com controle de página
- **Preload Strategy**: Estratégia de pré-carregamento de módulos
- **Pure Pipes**: Para transformações sem side-effects

## 📝 Requisitos de Entrega

### README.md deve conter:
1. **Dados de Inscrição**: Nome, vaga pretendida
2. **Arquitetura**: Explicação da estrutura do projeto
3. **Como Executar**: 
   - Instalação de dependências
   - Variáveis de ambiente necessárias
   - Como rodar localmente
   - Como rodar com Docker
4. **Como Testar**: Comandos para executar testes
5. **Deploy**: Como seria feito o deploy em produção
6. **Funcionalidades Implementadas**: Checklist do que foi feito
7. **Funcionalidades Não Implementadas**: O que não foi feito e por quê
8. **Decisões Técnicas**: Justificativa das escolhas

### Commits
- Commits pequenos e descritivos
- Seguir convenção definida no projeto
- Histórico limpo e legível

### Código
- Clean Code
- Comentários apenas quando necessário
- Nomenclatura clara e consistente
- Componentização adequada
- Código reutilizável e escalável

## ✅ Critérios de Avaliação (Total: 50 pontos)

### A. Estrutura e Organização (10 pontos)

| Critério | Descrição | Pontos |
|----------|-----------|---------|
| **Modularização Angular ou React** | Estrutura organizada em módulos, componentes e serviços | 0-4 |
| **Responsividade e UX** | Layout adaptável, visual limpo e intuitivo | 0-3 |
| **Documentação (README)** | Instruções de execução e dependências bem descritas | 0-3 |

### B. Funcionalidades (28 pontos)

| Critério | Descrição | Pontos |
|----------|-----------|---------|
| **Consumo da API** | CRUD completo consumindo endpoints (pets/tutores ou equivalente) | 0-6 |
| **Paginação e Busca** | Implementação de paginação e filtros dinâmicos | 0-3 |
| **Autenticação JWT** | Login, expiração e renovação do token | 0-5 |
| **Upload de imagens** | Upload funcional e exibição das fotos | 0-3 |
| **Lazy Loading** | Implementação de rotas dinâmicas para performance | 0-2 |
| **State Management (Sênior)** | Uso de BehaviorSubject, RxJS ou Facade Pattern | 0-3 |
| **Testes Unitários** | Testes de componentes e serviços | 0-3 |

### C. Boas Práticas e Entrega (15 pontos)

| Critério | Descrição | Pontos |
|----------|-----------|---------|
| **Clean Code** | Código limpo, reutilizável e padronizado | 0-4 |
| **Commits e versionamento** | Histórico coerente e incremental | 0-2 |
| **Performance e carregamento** | Lazy loading, cache e otimizações | 0-3 |
| **Documentação técnica e justificativas** | Clareza nas decisões técnicas | 0-3 |
| **Containerização/Deploy** | Aplicação empacotada via Docker funcional | 0-4 |

### 🎯 Distribuição de Pontos por Prioridade

**Essenciais (37 pontos - 74%)**
- Consumo da API (6 pts)
- Autenticação JWT (5 pts)
- Modularização (4 pts)
- Clean Code (4 pts)
- Containerização/Deploy (4 pts)
- Responsividade e UX (3 pts)
- Paginação e Busca (3 pts)
- Upload de imagens (3 pts)
- Documentação README (3 pts)
- Documentação técnica (3 pts)

**Importantes (10 pontos - 20%)**
- Testes Unitários (3 pts)
- State Management Sênior (3 pts)
- Performance e carregamento (3 pts)
- Commits e versionamento (2 pts)
- Lazy Loading (2 pts)

**Observação**: Priorize os itens essenciais primeiro para garantir a maior parte da pontuação!

## 🎯 Priorização Sugerida (Baseada na Pontuação)

### Sprint 1 - Fundação (18 pontos)
**Objetivo**: Estabelecer base sólida do projeto

1. ✅ Setup do projeto com modularização adequada (4 pts)
2. ✅ Docker e containerização funcional (4 pts)
3. ✅ Autenticação JWT completa (5 pts)
4. ✅ Documentação README inicial (3 pts)
5. ✅ Commits organizados desde o início (2 pts)

### Sprint 2 - Funcionalidades Core (15 pontos)
**Objetivo**: Implementar CRUD completo

6. ✅ Consumo completo da API - CRUD Pets e Tutores (6 pts)
7. ✅ Paginação e busca/filtros (3 pts)
8. ✅ Upload de fotos funcional (3 pts)
9. ✅ Lazy Loading de rotas (2 pts)

### Sprint 3 - UX e Qualidade (11 pontos)
**Objetivo**: Polir experiência do usuário

10. ✅ Responsividade completa (3 pts)
11. ✅ Clean Code e refatoração (4 pts)
12. ✅ Performance e otimizações (3 pts)
13. ✅ Documentação técnica e justificativas (3 pts)

### Sprint 4 - Diferencial Sênior (6 pontos)
**Objetivo**: Demonstrar senioridade técnica

14. ✅ Testes unitários (3 pts)
15. ✅ State Management com BehaviorSubject/Facade (3 pts)

### ⚠️ Estratégia de Pontuação

**Cenário Mínimo Viável (80% - 40 pts)**
- Sprints 1, 2 e 3 completos
- Garantia de aprovação

**Cenário Ideal (100% - 50 pts)**
- Todas as sprints completas
- Destaque na seleção

## ⚠️ Observações Importantes

- **Prazo**: Não enviar commits após o prazo estabelecido
- **Originalidade**: Todo código deve ser autoral
- **Completude**: Se não conseguir fazer tudo, priorize qualidade sobre quantidade
- **Explicação**: Documentar no README o que foi/não foi implementado e a priorização escolhida

## 🔗 Links Úteis

- **API Swagger**: https://pet-manager-api.geia.vip/q/swagger-ui/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **React Testing Library**: https://testing-library.com/react
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
