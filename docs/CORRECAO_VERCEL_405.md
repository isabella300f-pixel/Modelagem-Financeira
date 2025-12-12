# 🔧 Correção do Erro 405 no Vercel

## Problema
Erro 405 (Method Not Allowed) ao chamar `/api/process` no deploy do Vercel.

## Causas Possíveis
1. Runtime não configurado corretamente
2. Exportações da função POST não reconhecidas
3. Configuração do vercel.json incorreta

## Soluções Aplicadas

### 1. Configuração do vercel.json
```json
{
  "version": 2,
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "@vercel/node",
      "maxDuration": 60
    }
  }
}
```

### 2. Exportações na rota
- ✅ `export const runtime = 'nodejs18.x'`
- ✅ `export const dynamic = 'force-dynamic'`
- ✅ `export const maxDuration = 60`
- ✅ `export async function POST(request: NextRequest)`
- ✅ `export async function OPTIONS(request: NextRequest)`
- ✅ `export async function GET()` (retorna 405)

### 3. Headers nas respostas
Todas as respostas agora incluem:
```typescript
headers: {
  'Content-Type': 'application/json',
}
```

## Testar

1. Fazer deploy novamente:
```bash
git add .
git commit -m "fix: corrige erro 405 na API"
git push
```

2. Ou fazer deploy direto:
```bash
vercel --prod
```

3. Verificar logs no Vercel Dashboard:
   - Vá em Deployments → Seu deploy → Functions
   - Veja os logs da função `/api/process`

## Se ainda der erro 405

1. Verificar se a rota está em `app/api/process/route.ts` (não `pages/api/`)
2. Verificar se todas as exportações estão corretas
3. Limpar cache e fazer rebuild:
```bash
rm -rf .next
npm run build
```

## ✅ Status
- ✅ vercel.json atualizado
- ✅ Runtime configurado
- ✅ Headers corrigidos
- ✅ Tratamento de erros melhorado

