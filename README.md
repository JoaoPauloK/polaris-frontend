# Polaris Frontend

## Visão Geral

Este repositório contém o frontend do Polaris, um sistema de galerias fotográficas profissionais. O frontend é desenvolvido em React com TypeScript, utilizando Vite para build, Tailwind CSS para estilização e Zustand para gerenciamento de estado. Ele consome a API RESTful do backend para autenticação, gerenciamento de projetos, fotos e seleções.

## Estrutura do Projeto

- `src/App.tsx`: Definição das rotas e layout principal.
- `src/pages/`: Páginas principais (Landing, Login, Dashboard, Projects, Profile, etc).
- `src/components/`: Componentes reutilizáveis (PhotoGallery, Navbar, etc).
- `src/services/`: Serviços de integração com a API (auth, project, drive, etc).
- `src/store/`: Gerenciamento de estado global (authStore, projectStore).
- `src/types/`: Tipos TypeScript compartilhados.
- `src/utils/`: Funções utilitárias.

## Principais Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router v6
- Axios
- Framer Motion

## Configuração e Execução

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure as variáveis de ambiente em `.env` (exemplo em `.env.example`).
3. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

## Scripts Úteis

- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera o build de produção
- `npm run preview` — Visualiza o build de produção localmente

## Observações

- O frontend espera que o backend esteja rodando e acessível via URL configurada em `VITE_API_URL`.
- A autenticação é feita via cookies httpOnly, enviados automaticamente pelo navegador.
- As imagens são servidas diretamente do Google Drive via URLs públicas.
