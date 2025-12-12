# ⚠️ Limitação: Python no Vercel

## Problema

O Vercel Node.js runtime **não inclui Python** por padrão. Quando tentamos executar Python via subprocess (`exec`), recebemos o erro:

```
python3: command not found
```

## Soluções Possíveis

### Opção 1: Usar Vercel Serverless Functions Python (Recomendado)

Criar uma função Python separada que será executada no runtime Python do Vercel:

1. Criar arquivo `api/process.py` (função serverless Python)
2. Chamar essa função via HTTP do Next.js API route
3. Processar dados e retornar JSON

**Vantagens:**
- Funciona nativamente no Vercel
- Runtime Python dedicado
- Escalável

**Desvantagens:**
- Requer reestruturação do código
- Mais complexo de implementar

### Opção 2: API Externa

Criar um serviço separado (Railway, Render, Google Cloud Functions, etc.) que:
1. Executa Python
2. Expõe uma API REST
3. É chamado pelo Next.js via HTTP

**Vantagens:**
- Fácil de implementar
- Controle total sobre o ambiente

**Desvantagens:**
- Requer hospedagem adicional
- Latência de rede

### Opção 3: Portar para JavaScript/TypeScript

Converter toda a lógica Python para JavaScript/TypeScript usando bibliotecas como:
- `xlsx` para Excel
- Lógica customizada para DRE e KPIs

**Vantagens:**
- Funciona nativamente no Node.js
- Sem dependências externas

**Desvantagens:**
- Muito trabalho de portação
- Perda de lógica Python existente

## Status Atual

O código atual:
- ✅ Funciona localmente (com Python instalado)
- ❌ Não funciona no Vercel (sem Python)

## Solução Temporária

Para desenvolvimento, use localmente:
```bash
npm run dev
```

Para produção no Vercel, será necessário implementar uma das soluções acima.

## Recomendação

**Implementar Opção 1** (Vercel Serverless Function Python) para uma solução integrada e escalável.

