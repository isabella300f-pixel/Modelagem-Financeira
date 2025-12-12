# 📊 Sistema de Análise Financeira - DRE com Fallback Histórico

Sistema web completo para análise de planilhas financeiras, geração de DRE (Demonstração do Resultado do Exercício) e implementação de lógica inteligente de fallback histórico.

## 🎯 Funcionalidades

- ✅ **Upload de Arquivo Excel** (opcional)
- ✅ **Entrada Manual de Dados** - Insira dados diretamente sem arquivo
- ✅ **Extração Automática** - Extrai Receitas e Despesas automaticamente
- ✅ **Geração de DRE** - DRE Mensal, Trimestral e Anual
- ✅ **Lógica de Fallback** - Usa histórico quando dados atuais são insuficientes
- ✅ **KPIs Automáticos** - Margem Bruta, EBITDA, Margem Líquida
- ✅ **Dashboard Interativo** - Visualizações e gráficos
- ✅ **Exportação** - Excel, JSON, Relatório texto

## 🚀 Instalação Local

### Pré-requisitos
- Node.js 18+ 
- Python 3.8+
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd "Modelagem Financeira"
   ```

2. **Instalar dependências Node.js**
   ```bash
   npm install
   ```

3. **Instalar dependências Python**
   ```bash
   pip install -r requirements.txt
   ```

4. **Rodar localmente**
   ```bash
   npm run dev
   ```

5. **Acessar**
   - Abra: http://localhost:3000

## 📁 Estrutura do Projeto

```
projeto/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── process/       # Endpoint de processamento
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Dashboard.tsx
│   ├── FileUpload.tsx
│   ├── ManualInput.tsx
│   ├── Metrics.tsx
│   ├── DREView.tsx
│   ├── KPIs.tsx
│   ├── Flags.tsx
│   ├── Charts.tsx
│   └── ExportButtons.tsx
├── src/
│   └── core/              # Módulos Python principais
│       ├── extrator_planilha.py
│       ├── gerador_dre.py
│       └── sistema_analise_financeira.py
├── config/                # Configurações
│   └── mapeamento_dre.json
├── scripts/               # Scripts utilitários
│   ├── processar_api.py
│   └── rodar_sistema.py
├── docs/                  # Documentação
│   └── ...
├── data/                  # Dados (não versionado)
│   ├── exemplos/
│   └── resultados/
├── package.json           # Dependências Node.js
├── requirements.txt       # Dependências Python
├── vercel.json           # Configuração Vercel
├── next.config.js        # Configuração Next.js
└── README.md             # Este arquivo
```

## 🚀 Deploy no Vercel

### Opção 1: Via Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy produção
vercel --prod
```

### Opção 2: Via GitHub

1. **Fazer push para GitHub**
   ```bash
   git add .
   git commit -m "Sistema de Análise Financeira"
   git push origin main
   ```

2. **Conectar no Vercel**
   - Acesse: https://vercel.com
   - Clique em "Add New Project"
   - Importe o repositório do GitHub
   - Configure (Vercel detecta Next.js automaticamente)
   - Clique em "Deploy"

## 📋 Como Usar

### Modo Upload (Excel)
1. Selecione "📄 Upload de Arquivo Excel"
2. Faça upload da planilha Excel
3. (Opcional) Faça upload de base histórica CSV
4. Clique em "🔄 Processar Dados"

### Modo Manual
1. Selecione "✏️ Entrada Manual"
2. Adicione receitas: "+ Adicionar Receita" → Mês/Ano → Valor
3. Adicione despesas: "+ Adicionar Despesa" → Mês/Ano → Categoria → Valor
4. Clique em "🔄 Processar Dados Manuais"

## ⚙️ Configuração

### Variáveis de Ambiente
Não são necessárias variáveis de ambiente para funcionamento básico.

### Mapeamento DRE
Edite `config/mapeamento_dre.json` para personalizar:
- Mapeamento de categorias
- Estrutura do DRE
- Fórmulas de cálculo
- KPIs

## 🛠️ Desenvolvimento

### Rodar em modo desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
npm start
```

### Testar sistema Python
```bash
python scripts/rodar_sistema.py
```

## 📦 Dependências

### Node.js (package.json)
- next
- react
- axios
- recharts
- xlsx
- file-saver

### Python (requirements.txt)
- pandas
- numpy
- openpyxl

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
npm install
pip install -r requirements.txt
```

### Erro: "Timeout" no Vercel
- Aumente `maxDuration` em `vercel.json`
- Ou use plano Pro do Vercel

### Erro: "CORS"
- CORS já está configurado na API
- Verifique headers se necessário

## 📄 Licença

Este sistema foi desenvolvido para análise financeira e modelagem de negócios.

## 📞 Suporte

Consulte a documentação em `docs/` para mais detalhes:
- `docs/README_VERCEL.md` - Deploy no Vercel
- `docs/DEPLOY.md` - Guia de deploy
- `docs/GUIA_TESTE.md` - Guia de testes
