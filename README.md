# Pet Manager

Projeto de SPA em Angular (v21) para gerenciar pets e tutores — com Docker e Nginx para participação no Processo Seletivo: PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG e demais Órgãos - Engenheiro da Computação- Sênior

## Dados de Inscrição
- **Nome:** Douglas Frota Brandão
- **Vaga pretendida:** Analista de Tecnologia da Informação - Engenheiro da Computação Sênior
- **Número da inscrição:** 16299

## Resumo

- Framework: Angular 21 (standalone components)
- Build: multi-stage Dockerfile — build com `node` e runtime em `nginx`
- Estrutura principal:

```
src/
├── app/
│   ├── guards/       # controla rotas específicas
│   ├── services/     # mantém a comunicação com a api
│   ├── pages/        # páginas (standalone components)
│   ├── shared/       # componentes/serviços reutilizáveis
│   └── app.routes.ts # declara as rotas carregando os componentes
└── environments/
```

Arquivos importantes:

- Dockerfile — multi-stage build para gerar imagem final com Nginx
- docker/nginx/default.conf — config do Nginx (SPA + Health Check)
- docker-compose.yml — build
- Makefile: `make up`, `make down`, `make logs`, `make health`

## Como executar

Pré-requisitos (local): `node` (v18+), `npm`, ou `docker` + `docker compose`.

1) Execução em ambiente dev

```bash
# instalar dependências
npm ci

# rodar em modo dev
npm start
```

2) Build de produção

```bash
npm run build -- --configuration=production
# artefatos fica em dist/pet-manager/browser
```

3) Usando Docker Compose

```bash
# sobe a imagem e inicia os containers
make up

# logs
make logs

# health
make health

# derrubar
make down
```

Observações:
- O `docker-compose.yml` mapeia a porta `8080` do host para `80` do container — acesse `http://localhost:8080`.
- A imagem final contém apenas os assets estáticos e Nginx. O `HEALTHCHECK` consulta `/health`.

## Testes

Falta criar os testes

```bash
# executar testes unitários
npm test

# com coverage
npm test -- --coverage
```
