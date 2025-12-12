# ⚠️ Nota Importante sobre Deploy no Vercel

## Limitação do Vercel

O **Vercel não suporta Python Serverless Functions** da mesma forma que suporta Node.js. 

## Soluções Disponíveis

### Opção 1: API Externa (Recomendado)

Hospedar o processamento Python em um serviço separado:
- **Railway** (gratuito para iniciar)
- **Render** (gratuito com limitações)
- **Google Cloud Functions**
- **AWS Lambda**

E chamar essa API via HTTP do Next.js.

### Opção 2: Portar para JavaScript/TypeScript

Converter a lógica Python para JavaScript usando:
- `xlsx` para manipulação de Excel
- Bibliotecas matemáticas JavaScript para cálculos

### Opção 3: Desenvolvimento Local

Para desenvolvimento e testes, use localmente:
```bash
npm run dev
```

O sistema funciona perfeitamente localmente com Python instalado.

## Status Atual

- ✅ Frontend Next.js funcionando no Vercel
- ✅ API Routes Next.js funcionando no Vercel
- ❌ Processamento Python não funciona no Vercel (limitação da plataforma)

## Recomendação

Para produção, considere usar **Railway** ou **Render** para hospedar uma API Python separada que processa os dados e retorna JSON para o frontend Next.js no Vercel.

