# 📁 Estrutura do Projeto

## Organização de Pastas

```
projeto/
├── src/                          # Código-fonte
│   ├── core/                    # Módulos Python principais
│   │   ├── extrator_planilha.py
│   │   ├── gerador_dre.py
│   │   └── sistema_analise_financeira.py
│   └── web/                     # Aplicação web Next.js
│       ├── app/                 # Next.js App Router
│       │   ├── page.tsx
│       │   ├── layout.tsx
│       │   └── globals.css
│       ├── components/          # Componentes React
│       │   ├── Dashboard.tsx
│       │   ├── FileUpload.tsx
│       │   ├── Metrics.tsx
│       │   ├── DREView.tsx
│       │   ├── KPIs.tsx
│       │   ├── Flags.tsx
│       │   ├── Charts.tsx
│       │   └── ExportButtons.tsx
│       └── api/                 # API Routes (Python)
│           └── process/
│               └── index.py
│
├── config/                      # Arquivos de configuração
│   └── mapeamento_dre.json
│
├── data/                        # Dados
│   ├── exemplos/               # Arquivos de exemplo
│   │   └── exemplo_historico.csv
│   └── resultados/             # Resultados gerados
│       └── *.xlsx
│
├── scripts/                     # Scripts utilitários
│   ├── rodar_sistema.py
│   ├── exemplo_uso.py
│   ├── analisar_planilha.py
│   └── dashboard_streamlit.py
│
├── tests/                       # Testes
│   └── testar_sistema.py
│
├── docs/                        # Documentação
│   ├── README.md
│   ├── README_VERCEL.md
│   ├── DEPLOY.md
│   ├── GUIA_TESTE.md
│   └── COMO_TESTAR.txt
│
├── package.json                 # Dependências Node.js
├── requirements.txt             # Dependências Python (desenvolvimento)
├── requirements-vercel.txt      # Dependências Python (Vercel)
├── vercel.json                  # Configuração Vercel
├── next.config.js              # Configuração Next.js
├── tsconfig.json               # Configuração TypeScript
└── tailwind.config.js          # Configuração Tailwind
```

## 🚀 Como Rodar

### 1. Sistema Python (Backend)

```bash
# Da raiz do projeto
python scripts/rodar_sistema.py
```

### 2. Aplicação Web (Next.js)

```bash
# Instalar dependências
npm install

# Rodar desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

### 3. Dashboard Streamlit (Alternativo)

```bash
python scripts/dashboard_streamlit.py
```

## 📝 Imports

### Python
Os módulos em `src/core/` importam entre si diretamente:
```python
from extrator_planilha import ExtratorPlanilha
from gerador_dre import GeradorDRE
```

### Next.js
Os componentes usam imports relativos:
```typescript
import FileUpload from '../components/FileUpload'
```

## 🔧 Configurações

- **Mapeamento DRE**: `config/mapeamento_dre.json`
- **Vercel**: `vercel.json`
- **Next.js**: `next.config.js`
- **TypeScript**: `tsconfig.json`

## 📊 Dados

- **Planilhas**: Coloque em `data/resultados/`
- **Histórico**: Coloque em `data/exemplos/`
- **Resultados**: Gerados em `data/resultados/`

## ✅ Vantagens da Estrutura

- ✅ Separação clara de responsabilidades
- ✅ Fácil manutenção
- ✅ Pronto para deploy no Vercel
- ✅ Organizado e profissional
- ✅ Fácil de navegar

