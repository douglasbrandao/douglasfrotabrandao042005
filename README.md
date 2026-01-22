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
ng serve
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

---

## Testes

```bash
# executar testes unitários localmente
ng test
```

## Justificativas de Arquitetura

### Angular

Angular foi escolhido como framework principal pois um dos requisitos do projeto era o uso de TypeScript, e o Angular já traz suporte nativo e completo à linguagem. Além disso, por exigir clean code e padronização, o Angular se destaca por ser um framework opinativo, com arquitetura bem definida, CLI robusta e práticas recomendadas de mercado, facilitando a manutenção e escalabilidade do projeto.

### Vitest

Vitest foi escolhido para testes unitários por ser uma ferramenta moderna, rápida e já vir como padrão no Angular 21. Isso garante integração nativa, e facilidade de configuração.

### Outras decisões técnicas

- Standalone Components: adotados para reduzir boilerplate e simplificar a estrutura dos módulos.
- RxJS e Signals: para gerenciamento reativo de estado e melhor performance.
