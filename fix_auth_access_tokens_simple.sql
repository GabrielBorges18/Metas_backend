-- Script SIMPLES para alterar tokenable_id de BIGINT para UUID
-- IMPORTANTE: Execute apenas se a tabela auth_access_tokens estiver VAZIA
-- Caso contrário, você precisará deletar os tokens existentes primeiro

-- Opção 1: Se a tabela estiver VAZIA, execute:

-- 1. Deletar todos os tokens existentes (se houver)
DELETE FROM auth_access_tokens;

-- 2. Remover a foreign key constraint (se existir)
ALTER TABLE auth_access_tokens 
DROP CONSTRAINT IF EXISTS auth_access_tokens_tokenable_id_foreign;

-- 3. Alterar o tipo da coluna de BIGINT para UUID
-- Nota: Isso só funciona se a coluna estiver vazia ou se você usar uma estratégia de conversão
ALTER TABLE auth_access_tokens 
ALTER COLUMN tokenable_id TYPE UUID USING NULL;

-- Como não podemos converter BIGINT para UUID diretamente, a melhor opção é:
-- 3a. Remover a coluna
ALTER TABLE auth_access_tokens DROP COLUMN tokenable_id;

-- 3b. Recriar como UUID
ALTER TABLE auth_access_tokens 
ADD COLUMN tokenable_id UUID NOT NULL;

-- 4. Recriar a foreign key
ALTER TABLE auth_access_tokens 
ADD CONSTRAINT auth_access_tokens_tokenable_id_foreign 
FOREIGN KEY (tokenable_id) 
REFERENCES users(id) 
ON DELETE CASCADE;
