-- Script para corrigir auth_access_tokens: alterar tokenable_id de BIGINT para UUID
-- IMPORTANTE: Execute este script APENAS se a tabela auth_access_tokens estiver VAZIA
-- ou se você não se importar em perder os tokens existentes

-- PASSO 1: Verificar se há tokens (execute manualmente)
-- SELECT COUNT(*) FROM auth_access_tokens;

-- PASSO 2: Se houver tokens e você não precisa deles, delete:
-- DELETE FROM auth_access_tokens;

-- PASSO 3: Executar os comandos abaixo:

BEGIN;

-- Remover foreign key se existir
ALTER TABLE auth_access_tokens 
DROP CONSTRAINT IF EXISTS auth_access_tokens_tokenable_id_foreign;

-- Remover a coluna tokenable_id antiga (BIGINT)
ALTER TABLE auth_access_tokens 
DROP COLUMN tokenable_id;

-- Adicionar a nova coluna tokenable_id como UUID
ALTER TABLE auth_access_tokens 
ADD COLUMN tokenable_id UUID NOT NULL;

-- Adicionar a foreign key
ALTER TABLE auth_access_tokens 
ADD CONSTRAINT auth_access_tokens_tokenable_id_foreign 
FOREIGN KEY (tokenable_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

COMMIT;

-- Verificação final
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'auth_access_tokens' 
-- AND column_name = 'tokenable_id';
