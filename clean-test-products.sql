-- Limpar produtos de teste (preço <= 1.00)
-- Execute este SQL diretamente no Supabase SQL Editor

DELETE FROM "Product" 
WHERE "price" <= 1.00;

-- Verificar produtos restantes
SELECT COUNT(*) as produtos_restantes FROM "Product";

-- Mostrar produtos que serão deletados (para verificação)
SELECT id, name, price 
FROM "Product" 
WHERE "price" <= 1.00
ORDER BY price;
