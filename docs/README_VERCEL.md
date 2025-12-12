# 🚀 Deploy no Vercel - Sistema de Análise Financeira

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Node.js instalado (para desenvolvimento local)
3. Git instalado

## 🔧 Instalação Local (Opcional)

```bash
# Instalar dependências Node.js
npm install

# Instalar dependências Python
pip install -r requirements-vercel.txt

# Rodar localmente
npm run dev
```

Acesse: http://localhost:3000

## 📤 Deploy no Vercel

### Opção 1: Via Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Opção 2: Via GitHub

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/analise-financeira.git
   git push -u origin main
   ```

2. **Conectar no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório do GitHub
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: ./
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Clique em "Deploy"

### Opção 3: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Faça upload da pasta do projeto
4. Configure e clique em "Deploy"

## ⚙️ Configuração

### Variáveis de Ambiente (Opcional)

No Vercel, você pode adicionar variáveis de ambiente em:
**Settings → Environment Variables**

Não são necessárias variáveis para o funcionamento básico.

### Configuração de Build

O arquivo `vercel.json` já está configurado para:
- Next.js (frontend)
- Python serverless functions (API)
- Timeout de 60 segundos para processamento

## 📁 Estrutura do Projeto

```
.
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Dashboard.tsx
│   ├── FileUpload.tsx
│   ├── Metrics.tsx
│   ├── DREView.tsx
│   ├── KPIs.tsx
│   ├── Flags.tsx
│   ├── Charts.tsx
│   └── ExportButtons.tsx
├── api/                   # API Routes (Python)
│   └── process/
│       └── index.py       # Endpoint de processamento
├── extrator_planilha.py   # Módulo de extração
├── gerador_dre.py         # Módulo de geração DRE
├── sistema_analise_financeira.py  # Sistema principal
├── mapeamento_dre.json    # Configuração
├── vercel.json            # Config Vercel
├── package.json           # Dependências Node.js
└── requirements-vercel.txt # Dependências Python
```

## 🎯 Funcionalidades

✅ Upload de planilha Excel
✅ Upload opcional de base histórica CSV
✅ Processamento em tempo real
✅ Visualização interativa:
   - Dashboard com métricas
   - DRE Mensal/Trimestral/Anual
   - KPIs com gráficos
   - Flags de coverage
   - Gráficos interativos
✅ Exportação:
   - Excel (.xlsx)
   - JSON
   - Relatório texto

## 🔍 Troubleshooting

### Erro: "Module not found"
- Verifique se todos os arquivos Python estão no repositório
- Confirme que `requirements-vercel.txt` está atualizado

### Erro: "Timeout"
- O processamento pode levar até 60 segundos
- Arquivos muito grandes podem precisar de timeout maior
- Ajuste em `vercel.json` → `functions.maxDuration`

### Erro: "CORS"
- CORS já está configurado na API
- Verifique se os headers estão corretos

### Erro no Build
- Verifique logs no Vercel Dashboard
- Confirme que Node.js e Python estão configurados
- Teste localmente primeiro: `npm run dev`

## 📊 Limites do Vercel

- **Timeout**: 60 segundos (configurável)
- **Tamanho de arquivo**: 10MB (pode ser aumentado)
- **Memória**: 1024MB (plano Hobby)

Para arquivos maiores ou processamento mais pesado, considere:
- Upgrade para plano Pro
- Usar Vercel Edge Functions
- Processar em background com queue

## 🚀 Próximos Passos

1. **Deploy**: Siga uma das opções acima
2. **Teste**: Acesse sua URL do Vercel
3. **Customize**: Ajuste cores, textos em `components/`
4. **Monitore**: Use Vercel Analytics para métricas

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Python Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python)

## 🎉 Pronto!

Seu sistema está pronto para ser hospedado no Vercel! 🚀

