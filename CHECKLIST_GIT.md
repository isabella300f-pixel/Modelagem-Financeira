# ✅ Checklist para Git e Deploy

## 📋 Antes de Fazer Commit

### Arquivos e Estrutura
- [x] ✅ Código organizado em pastas
- [x] ✅ `.gitignore` configurado corretamente
- [x] ✅ `.gitattributes` criado
- [x] ✅ README.md principal na raiz
- [x] ✅ Documentação organizada

### Configurações
- [x] ✅ `package.json` completo
- [x] ✅ `requirements.txt` completo
- [x] ✅ `vercel.json` configurado
- [x] ✅ `next.config.js` configurado
- [x] ✅ `tsconfig.json` configurado

### Arquivos Não Versionados
- [x] ✅ node_modules/ no .gitignore
- [x] ✅ .next/ no .gitignore
- [x] ✅ Arquivos Excel não versionados
- [x] ✅ Arquivos temporários ignorados
- [x] ✅ Resultados gerados ignorados

## 🚀 Comandos para Subir no Git

```bash
# 1. Verificar status
git status

# 2. Adicionar arquivos
git add .

# 3. Commit
git commit -m "Sistema de Análise Financeira - Versão completa"

# 4. Adicionar remote (se ainda não tiver)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

# 5. Push
git push -u origin main
```

## ☁️ Deploy no Vercel

### Após Push no GitHub
1. Acesse: https://vercel.com
2. "Add New Project"
3. Importe repositório GitHub
4. Vercel detecta Next.js
5. Clique "Deploy"

## 🏃 Testar Localmente

```bash
# Instalar
npm install
pip install -r requirements.txt

# Rodar
npm run dev

# Acessar
http://localhost:3000
```

## ✅ Verificação Final

- [ ] Todos arquivos importantes commitados
- [ ] .gitignore funcionando
- [ ] README.md atualizado
- [ ] Testado localmente
- [ ] Pronto para deploy!

