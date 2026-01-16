import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

// Suporta DATABASE_URL (para Render/Neon) ou variáveis individuais (para desenvolvimento)
const getDatabaseConnection = () => {
  const databaseUrl = env.get('DATABASE_URL')
  
  // Se DATABASE_URL existe, usa diretamente (formato do Neon/Render)
  if (databaseUrl) {
    return databaseUrl
  }

  // Fallback para variáveis individuais se DATABASE_URL não existir
  const host = env.get('DB_HOST')
  const port = env.get('DB_PORT')
  const user = env.get('DB_USER')
  const password = env.get('DB_PASSWORD')
  const database = env.get('DB_DATABASE')

  if (!host || !port || !user || !database) {
    throw new Error(
      'Database configuration is missing. Provide either DATABASE_URL or all individual DB_* variables (DB_HOST, DB_PORT, DB_USER, DB_DATABASE).'
    )
  }

  return {
    host,
    port,
    user,
    password: password || undefined,
    database,
  }
}

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: getDatabaseConnection(),
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig