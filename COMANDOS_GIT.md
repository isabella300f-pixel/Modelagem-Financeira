# 📦 Comandos Git - Pronto para Usar

## 🚀 Primeiro Deploy

### 1. Inicializar Git (se ainda não tiver)
```bash
git init
git branch -M main
```

### 2. Adicionar Todos os Arquivos
```bash
git add .
```

### 3. Primeiro Commit
```bash
git commit -m "Initial commit: Sistema de Análise Financeira completo"
```

### 4. Adicionar Remote (GitHub)
```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

### 5. Push para GitHub
```bash
git push -u origin main
```

## 📝 Atualizações Futuras

### Adicionar Mudanças
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

### Ver Status
```bash
git status
```

### Ver Diferenças
```bash
git diff
```

## ☁️ Deploy no Vercel

Após push no GitHub:
1. Acesse: https://vercel.com
2. "Add New Project"
3. Importe repositório
4. Deploy automático!

## ✅ Verificação

```bash
# Ver arquivos que serão commitados
git status

# Ver o que está no .gitignore
cat .gitignore

# Testar localmente antes de commit
npm run dev
```

## 🎉 Pronto!

Sistema pronto para:
- ✅ Git/GitHub
- ✅ Deploy no Vercel
- ✅ Desenvolvimento local

