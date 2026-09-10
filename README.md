# Fluxo | Gestão de tarefas

Aplicação Kanban com PostgreSQL, Prisma e pgAdmin.

## Configuração

1. Crie um banco PostgreSQL vazio chamado `fluxo_tasks` no pgAdmin.
2. Copie `.env.example` para `.env` e informe a senha do PostgreSQL.
3. Instale as dependências com `npm install`.
4. Execute `npx prisma generate`.
5. Crie as tabelas com `npm run prisma:migrate`.
6. Execute `npm run prisma:seed` apenas para limpar o banco em um ambiente de teste. O banco começa sem usuários e sem tarefas.
7. Inicie com `npm run dev` e acesse `http://localhost:3000`.

O Prisma cria e atualiza a estrutura do PostgreSQL; o pgAdmin serve para criar o banco, visualizar tabelas e acompanhar os registros. Não é necessário executar script SQL manualmente.

## Funcionalidades

- Criação de conta com nome, e-mail e senha.
- Senha armazenada com hash seguro usando `bcryptjs`.
- Login bloqueado quando o e-mail ou a senha estão incorretos.
- Botão para sair da conta e voltar à tela de login.
- Cadastro de usuários com validação de e-mail e prevenção de duplicidade.
- Cadastro, edição, mudança de status e exclusão de tarefas.
- Quadro inicial vazio quando não houver tarefas no banco.
- Persistência real em PostgreSQL por meio do Prisma.

O frontend está separado em `frontend/` (`index.html`, `app.js` e `styles.css`). O backend está em `backend/server.js` e importa o cliente Prisma de `backend/lib/prisma.ts`. O modelo e os diagramas estão em `prisma/schema.prisma` e `diagramas.md`.

## Como confirmar a conexão com o banco

1. Inicie o servidor com `npm run dev` e abra `http://localhost:3000`.
2. Crie uma conta, entre no sistema e cadastre uma tarefa.
3. No pgAdmin, abra `saep_tarefas > Schemas > public > Tables > Usuario` ou `Tarefa` e use **View/Edit Data**. O registro deve aparecer ali.
4. Pelo terminal, confirme as quantidades diretamente no Prisma:

```bash
npx prisma studio
```

O Prisma Studio mostra os registros que a aplicação está salvando no PostgreSQL. Também é possível verificar pelo pgAdmin atualizando a tabela depois de cada cadastro, alteração ou exclusão.

Para testar a senha, tente entrar com uma senha errada: a API deve responder `E-mail ou senha incorretos.` e a tela não será liberada.