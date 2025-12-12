# ✅ Como Rodar o Sistema

## 🎯 Sistema Python (Backend)

### Opção 1: Script Principal
```bash
python scripts/rodar_sistema.py
```

### Opção 2: Teste Rápido
```bash
python testar_organizado.py
```

### Opção 3: Teste Completo
```bash
python tests/testar_sistema.py
```

## 🌐 Aplicação Web (Next.js)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar em Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### 3. Build para Produção
```bash
npm run build
npm start
```

## 📊 Dashboard Streamlit (Alternativo)
```bash
python scripts/dashboard_streamlit.py
```

## 🚀 Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy produção
vercel --prod
```

## ✅ Status

- ✅ Sistema Python funcionando
- ✅ Imports corrigidos
- ✅ Estrutura organizada
- ⚠️ Next.js precisa ajuste de caminhos (ver abaixo)

## ⚠️ Ajuste Necessário para Next.js

O Next.js precisa que os arquivos estejam em `app/` na raiz. Você tem duas opções:

### Opção 1: Mover app/ para raiz (Recomendado)
```bash
# Mover app e components para raiz
Move-Item src/web/app app
Move-Item src/web/components components
```

### Opção 2: Ajustar next.config.js
Manter estrutura atual e ajustar configuração (mais complexo)

## 📁 Estrutura Atual

```
projeto/
├── src/
│   ├── core/          # ✅ Python funcionando
│   └── web/           # ⚠️ Precisa ajuste
├── config/            # ✅ Configurações
├── data/              # ✅ Dados
├── scripts/           # ✅ Scripts
└── tests/             # ✅ Testes
```

## 🎉 Pronto para Usar!

O sistema Python está **100% funcional** e organizado! 🚀

