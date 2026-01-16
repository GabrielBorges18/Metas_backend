<<<<<<< HEAD
# Metas Backend API

Backend completo para o sistema de gerenciamento de metas (Squad Goals) desenvolvido com AdonisJS.

## Tecnologias

- AdonisJS 6
- TypeScript
- PostgreSQL
- Lucid ORM
- VineJS (Validação)
- Token-based Authentication

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (crie um arquivo `.env`):
```env
NODE_ENV=development
PORT=3333
APP_KEY=your-app-key-here
HOST=0.0.0.0
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_DATABASE=metas_db
```

3. Execute as migrações:
```bash
node ace migration:run
```

4. Inicie o servidor:
```bash
npm run dev
```

## Estrutura do Banco de Dados

- `users` - Usuários do sistema
- `groups` - Grupos de usuários
- `group_members` - Relacionamento muitos-para-muitos entre grupos e usuários
- `meta_grandes` - Metas principais
- `meta_pequenas` - Sub-metas

## API Endpoints

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  "token": "oat_..."
}
```

#### POST `/api/auth/login`
Realiza login.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "nome": "João Silva",
    "email": "joao@example.com"
  },
  "token": "oat_..."
}
```

#### GET `/api/auth/me` (Protegida)
Retorna informações do usuário autenticado.

**Headers:**
```
Authorization: Bearer oat_...
```

#### POST `/api/auth/logout` (Protegida)
Realiza logout.

### Grupos

#### GET `/api/groups` (Protegida)
Lista todos os grupos do usuário autenticado.

#### POST `/api/groups` (Protegida)
Cria um novo grupo.

**Body:**
```json
{
  "nome": "Dev Team 2026",
  "descricao": "Grupo de desenvolvimento"
}
```

#### POST `/api/groups/join` (Protegida)
Entra em um grupo usando código de convite.

**Body:**
```json
{
  "codigoConvite": "ABC123"
}
```

#### GET `/api/groups/:id` (Protegida)
Retorna detalhes de um grupo específico.

### Metas

#### GET `/api/metas` (Protegida)
Lista todas as metas do usuário. Pode filtrar por grupo:
```
GET /api/metas?grupoId=1
```

#### POST `/api/metas` (Protegida)
Cria uma nova meta.

**Body:**
```json
{
  "tipo": "Profissional",
  "titulo": "Portfólio GitHub com 10 projetos",
  "descricao": "Descrição detalhada",
  "status": "ativa",
  "dataInicio": "2026-01-01",
  "dataPrazo": "2026-12-31",
  "grupoId": 1,
  "metasPequenas": [
    {
      "titulo": "Projeto 1"
    },
    {
      "titulo": "Projeto 2"
    }
  ]
}
```

#### GET `/api/metas/:id` (Protegida)
Retorna detalhes de uma meta específica.

#### PUT `/api/metas/:id` (Protegida)
Atualiza uma meta.

**Body:**
```json
{
  "titulo": "Título atualizado",
  "status": "concluída",
  "metasPequenas": [
    {
      "id": 1,
      "titulo": "Meta pequena atualizada",
      "status": "concluída"
    }
  ]
}
```

#### DELETE `/api/metas/:id` (Protegida)
Exclui uma meta.

### Metas Pequenas

#### POST `/api/metas/:id/metas-pequenas` (Protegida)
Adiciona uma meta pequena a uma meta grande.

**Body:**
```json
{
  "titulo": "Nova meta pequena"
}
```

#### PUT `/api/metas/:id/metas-pequenas/:metaPequenaId` (Protegida)
Atualiza uma meta pequena.

**Body:**
```json
{
  "titulo": "Título atualizado",
  "status": "concluída"
}
```

#### DELETE `/api/metas/:id/metas-pequenas/:metaPequenaId` (Protegida)
Exclui uma meta pequena.

## Autenticação

A maioria das rotas requer autenticação. Para acessar rotas protegidas, inclua o token de acesso no header:

```
Authorization: Bearer oat_...
```

O token é retornado após o registro ou login bem-sucedido.

## Tipos de Meta

- `Profissional`
- `Pessoal`
- `Estudos`
- `Saúde`
- `Outro`

## Status de Meta Grande

- `ativa`
- `concluída`
- `pausada`

## Status de Meta Pequena

- `pendente`
- `concluída`
=======
# Metas_backend
>>>>>>> 010391fe6465077beee6bd9ce7e8f03d67969a8c
