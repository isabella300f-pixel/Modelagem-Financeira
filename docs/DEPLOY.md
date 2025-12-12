# 🚀 Guia de Deploy no Vercel

## ⚡ Deploy Rápido

### 1. Via Vercel CLI (Mais Rápido)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy (primeira vez)
vercel

# Deploy para produção
vercel --prod
```

### 2. Via GitHub (Recomendado para produção)

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Sistema de Análise Financeira"
   git remote add origin https://github.com/SEU-USUARIO/analise-financeira.git
   git push -u origin main
   ```

2. **Conectar no Vercel**
   - Acesse: https://vercel.com
   - Clique em "Add New Project"
   - Importe seu repositório GitHub
   - **Configurações automáticas** (Vercel detecta Next.js)
   - Clique em "Deploy"

### 3. Via Interface Web (Upload direto)

1. Acesse: https://vercel.com
2. Clique em "Add New Project"
3. Clique em "Browse" e selecione a pasta do projeto
4. Clique em "Deploy"

## ✅ Checklist Antes do Deploy

- [ ] Todos os arquivos estão na pasta
- [ ] `package.json` está configurado
- [ ] `vercel.json` está presente
- [ ] `requirements-vercel.txt` está presente
- [ ] Arquivos Python estão na raiz ou em `api/`

## 📁 Estrutura Necessária

```
projeto/
├── app/                    # Next.js
├── components/            # React components
├── api/                   # Python API
│   └── process/
│       └── index.py
├── *.py                   # Módulos Python
├── package.json
├── vercel.json
├── requirements-vercel.txt
└── README.md
```

## 🔧 Configurações Importantes

### vercel.json
Já configurado para:
- Next.js (frontend)
- Python serverless functions
- Timeout de 60 segundos
- CORS habilitado

### requirements-vercel.txt
Dependências Python mínimas:
- pandas
- numpy
- openpyxl

## 🎯 Após o Deploy

1. **Acesse sua URL**: `https://seu-projeto.vercel.app`
2. **Teste o upload** de uma planilha Excel
3. **Verifique os logs** em caso de erro

## 🐛 Troubleshooting

### Erro: "Module not found"
- Verifique se todos os `.py` estão no repositório
- Confirme imports nos arquivos Python

### Erro: "Timeout"
- Aumente `maxDuration` em `vercel.json`
- Ou use plano Pro do Vercel

### Erro: "Build failed"
- Verifique logs no Vercel Dashboard
- Teste localmente: `npm run dev`

## 📊 Limites Gratuitos

- **Timeout**: 10s (Hobby) / 60s (Pro)
- **Tamanho**: 10MB por arquivo
- **Memória**: 1024MB

## 🎉 Pronto!

Seu sistema estará online em minutos! 🚀

