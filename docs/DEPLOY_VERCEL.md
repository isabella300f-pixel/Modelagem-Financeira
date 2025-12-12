# ☁️ Deploy no Vercel - Guia Completo

## 🚀 Métodos de Deploy

### Método 1: Via GitHub (Recomendado)

1. **Fazer push para GitHub**
   ```bash
   git add .
   git commit -m "Sistema de Análise Financeira"
   git push origin main
   ```

2. **Conectar no Vercel**
   - Acesse: https://vercel.com
   - Clique em "Add New Project"
   - Importe seu repositório GitHub
   - Vercel detecta Next.js automaticamente
   - Clique em "Deploy"

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (primeira vez)
vercel

# Deploy para produção
vercel --prod
```

### Método 3: Via Interface Web

1. Acesse: https://vercel.com
2. "Add New Project"
3. Faça upload da pasta do projeto
4. Configure e clique em "Deploy"

## ⚙️ Configuração do Vercel

### Build Settings (Automático)
O Vercel detecta automaticamente:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Python Runtime
O Vercel detecta automaticamente arquivos Python em `app/api/` e usa runtime Python 3.9.

### Timeout
- **Hobby (Gratuito)**: 10 segundos
- **Pro**: 60 segundos (configurado em `vercel.json`)

## 📋 Requisitos no Vercel

1. **Node.js**: 18+ (definido em `.nvmrc`)
2. **Python**: 3.9 (usado pelo Vercel automaticamente)
3. **Dependências**: Instaladas automaticamente do `package.json` e `requirements.txt`

## 🔧 Variáveis de Ambiente

Não são necessárias variáveis de ambiente para funcionamento básico.

Se precisar adicionar:
1. Vercel Dashboard → Settings → Environment Variables
2. Adicione suas variáveis
3. Redeploy

## 📊 Verificar Deploy

Após o deploy:
1. Acesse sua URL: `https://seu-projeto.vercel.app`
2. Teste upload de arquivo
3. Teste entrada manual
4. Verifique logs em caso de erro

## 🐛 Troubleshooting

### Build Failed
- Verifique logs no Vercel Dashboard
- Confirme que `package.json` está correto
- Verifique se todas dependências estão listadas

### Runtime Error
- Verifique logs do servidor
- Confirme que Python está instalado
- Verifique imports dos módulos Python

### Timeout
- Aumente `maxDuration` em `vercel.json`
- Ou use plano Pro (60s)

### CORS
- CORS já está configurado
- Verifique headers se necessário

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] `vercel.json` configurado
- [ ] `package.json` completo
- [ ] `requirements.txt` completo
- [ ] README.md atualizado
- [ ] Testado localmente
- [ ] Deploy realizado
- [ ] Testado no Vercel

## 🎉 Pronto!

Seu sistema está no ar! 🚀

