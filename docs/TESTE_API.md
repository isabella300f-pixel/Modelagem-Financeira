# 🧪 Teste da API Route

## Como Testar a Rota

### 1. Teste Local
```bash
npm run dev
```

### 2. Testar com curl
```bash
# Teste POST simples
curl -X POST http://localhost:3000/api/process \
  -H "Content-Type: application/json" \
  -d '{"manualData": {"receitas": []}}'

# Teste GET (deve retornar 405)
curl -X GET http://localhost:3000/api/process
```

### 3. Testar Rota de Teste
```bash
# Criar rota de teste simples em app/api/test/route.ts
curl -X POST http://localhost:3000/api/test
```

## Se a Rota de Teste Funcionar

Se `/api/test` funcionar mas `/api/process` não, o problema está na lógica da rota `process`.

## Se Nenhuma Rota Funcionar

Pode ser um problema com:
1. Configuração do Next.js
2. Estrutura de pastas
3. Build do projeto

## Verificar Build
```bash
npm run build
```

Se o build falhar, corriga os erros primeiro.

