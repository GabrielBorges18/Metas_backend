# Configuração no Render

## Variáveis de Ambiente Necessárias

No Render Dashboard, configure as seguintes variáveis de ambiente:

### Obrigatórias

1. **APP_KEY** - Chave de aplicação do AdonisJS
   - Gere com: `node ace generate:key`
   - Ou use: `openssl rand -base64 32`

2. **DATABASE_URL** - URL de conexão do banco de dados (Neon/PostgreSQL)
   - Formato: `postgresql://user:password@host:port/database?sslmode=require`
   - Obtido do painel do Neon ou outro provedor PostgreSQL

### Opcionais (têm valores padrão no render.yaml)

- **NODE_ENV** - `production`
- **HOST** - `0.0.0.0`
- **PORT** - `10000`
- **LOG_LEVEL** - `info`

## Executar Migrações

Para executar as migrações no Render, você tem duas opções:

### Opção 1: Executar manualmente via SSH/Console do Render

1. Acesse o console do serviço no Render Dashboard
2. Execute:
```bash
node ace migration:run
```

### Opção 2: Configurar script de build (recomendado)

Atualize o `buildCommand` no `render.yaml`:

```yaml
buildCommand: npm ci && npm run build && node ace migration:run --force
```

**Nota:** Use `--force` apenas se tiver certeza que quer executar migrações automaticamente em cada deploy.

## Configuração Local vs Render

### Desenvolvimento Local (.env)
```env
NODE_ENV=development
PORT=3333
APP_KEY=your-app-key
HOST=0.0.0.0
LOG_LEVEL=info

# Usar variáveis individuais
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=senha
DB_DATABASE=metas_db

# OU usar DATABASE_URL
# DATABASE_URL=postgresql://user:password@localhost:5432/metas_db
```

### Render (Variáveis de Ambiente)
- Use `DATABASE_URL` (recomendado para Neon/Render PostgreSQL)
- As variáveis individuais (`DB_HOST`, `DB_PORT`, etc.) não são necessárias quando `DATABASE_URL` está configurado

## Troubleshooting

### Erro: "Missing environment variable"

Certifique-se de que todas as variáveis obrigatórias estão configuradas no Render Dashboard:
- `APP_KEY`
- `DATABASE_URL`

### Erro ao conectar ao banco de dados

1. Verifique se o `DATABASE_URL` está correto
2. Certifique-se de que o banco aceita conexões externas
3. No Neon, verifique se o SSL está habilitado (`?sslmode=require`)

### Migrações não executam

1. Execute manualmente via console do Render
2. Ou adicione ao `buildCommand` (cuidado: executa em cada deploy)
