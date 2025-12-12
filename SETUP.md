# 🛠️ Guia de Setup Completo

## 📋 Checklist Antes de Subir para Git

### ✅ Estrutura de Pastas
- [x] Código organizado em pastas (`app/`, `components/`, `src/core/`)
- [x] Documentação em `docs/`
- [x] Scripts em `scripts/`
- [x] Configurações em `config/`

### ✅ Arquivos de Configuração
- [x] `.gitignore` configurado
- [x] `.gitattributes` criado
- [x] `package.json` com dependências
- [x] `requirements.txt` com dependências Python
- [x] `vercel.json` configurado
- [x] `next.config.js` configurado

### ✅ Documentação
- [x] `README.md` principal
- [x] Documentação de deploy
- [x] Guias de uso

## 🚀 Passos para Subir no Git

### 1. Inicializar Git (se ainda não tiver)
```bash
git init
git branch -M main
```

### 2. Adicionar Arquivos
```bash
git add .
```

### 3. Primeiro Commit
```bash
git commit -m "Initial commit: Sistema de Análise Financeira"
```

### 4. Adicionar Remote (GitHub)
```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

### 5. Push
```bash
git push -u origin main
```

## ☁️ Deploy no Vercel

### Via GitHub (Recomendado)
1. Faça push para GitHub (passos acima)
2. Acesse: https://vercel.com
3. Clique em "Add New Project"
4. Importe seu repositório
5. Vercel detecta Next.js automaticamente
6. Clique em "Deploy"

### Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 🏃 Rodar Localmente

### 1. Instalar Dependências
```bash
# Node.js
npm install

# Python
pip install -r requirements.txt
```

### 2. Rodar Desenvolvimento
```bash
npm run dev
```

### 3. Acessar
http://localhost:3000

## ✅ Verificações Finais

### Antes do Deploy
- [ ] Todos os arquivos importantes estão no Git
- [ ] `.gitignore` está correto
- [ ] `package.json` tem todas dependências
- [ ] `requirements.txt` tem todas dependências Python
- [ ] `vercel.json` está configurado
- [ ] README.md está atualizado

### Testar Localmente
- [ ] `npm install` funciona
- [ ] `npm run dev` inicia
- [ ] Upload de arquivo funciona
- [ ] Entrada manual funciona
- [ ] Processamento gera resultados

## 📝 Notas Importantes

1. **Não versionar**: 
   - Arquivos Excel de dados reais
   - Resultados gerados
   - Node modules
   - Arquivos temporários

2. **Versionar**:
   - Código-fonte
   - Configurações
   - Documentação
   - Scripts

3. **Vercel**:
   - Detecta Next.js automaticamente
   - Precisa que Python esteja nas dependências
   - Timeout padrão: 10s (Hobby) / 60s (Pro)

## 🎉 Pronto!

Sistema pronto para:
- ✅ Git/GitHub
- ✅ Deploy no Vercel
- ✅ Desenvolvimento local

