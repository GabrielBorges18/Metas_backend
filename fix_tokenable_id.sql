-- Script para alterar tokenable_id de BIGINT para UUID
-- Execute este script no PostgreSQL

BEGIN;

-- 1. Verificar se há tokens (opcional - descomente para verificar)
-- SELECT COUNT(*) as total_tokens FROM auth_access_tokens;

-- 2. Se quiser deletar todos os tokens primeiro (descomente se necessário)
-- DELETE FROM auth_access_tokens;

-- 3. Remover a foreign key constraint (se existir)
ALTER TABLE auth_access_tokens 
DROP CONSTRAINT IF EXISTS auth_access_tokens_tokenable_id_foreign;

-- 4. Remover a coluna tokenable_id antiga (BIGINT)
ALTER TABLE auth_access_tokens 
DROP COLUMN tokenable_id;

-- 5. Adicionar a nova coluna tokenable_id como UUID
ALTER TABLE auth_access_tokens 
ADD COLUMN tokenable_id UUID NOT NULL;

-- 6. Criar a foreign key para referenciar users(id)
ALTER TABLE auth_access_tokens 
ADD CONSTRAINT auth_access_tokens_tokenable_id_foreign 
FOREIGN KEY (tokenable_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

COMMIT;

-- Verificação: confirme que a coluna agora é UUID
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'auth_access_tokens' 
-- AND column_name = 'tokenable_id';
