# 📁 Estrutura do Projeto

## 📂 Organização de Arquivos

```
projeto/
├── 📄 README.md                    # Documentação principal
├── ⚡ QUICKSTART.md                # Guia rápido
├── 🛠️ SETUP.md                     # Setup completo
├── ✅ CHECKLIST_GIT.md             # Checklist para Git
│
├── 📦 Configurações
│   ├── package.json                # Dependências Node.js
│   ├── requirements.txt            # Dependências Python
│   ├── vercel.json                 # Config Vercel
│   ├── next.config.js              # Config Next.js
│   ├── tsconfig.json               # Config TypeScript
│   ├── tailwind.config.js          # Config Tailwind
│   ├── postcss.config.js           # Config PostCSS
│   ├── .gitignore                  # Arquivos ignorados
│   ├── .gitattributes              # Atributos Git
│   ├── .nvmrc                      # Versão Node.js
│   └── .python-version             # Versão Python
│
├── 🌐 Aplicação Web (Next.js)
│   ├── app/
│   │   ├── api/
│   │   │   └── process/
│   │   │       └── route.ts        # API Route Next.js
│   │   ├── page.tsx                # Página principal
│   │   ├── layout.tsx              # Layout
│   │   └── globals.css             # Estilos globais
│   │
│   └── components/                 # Componentes React
│       ├── Dashboard.tsx           # Dashboard principal
│       ├── FileUpload.tsx          # Upload de arquivos
│       ├── ManualInput.tsx         # Entrada manual
│       ├── Metrics.tsx             # Métricas principais
│       ├── DREView.tsx             # Visualização DRE
│       ├── KPIs.tsx                # Indicadores
│       ├── Flags.tsx               # Flags de coverage
│       ├── Charts.tsx              # Gráficos
│       ├── ExportButtons.tsx       # Exportação
│       └── LoadingSpinner.tsx      # Loading
│
├── 🐍 Código Python
│   └── src/
│       └── core/                   # Módulos principais
│           ├── extrator_planilha.py    # Extração de dados
│           ├── gerador_dre.py          # Geração de DRE
│           └── sistema_analise_financeira.py  # Sistema principal
│
├── ⚙️ Configurações
│   └── config/
│       └── mapeamento_dre.json     # Mapeamento DRE
│
├── 🔧 Scripts
│   └── scripts/
│       ├── processar_api.py        # Processamento via API
│       ├── rodar_sistema.py        # Script principal
│       └── ...                     # Outros scripts
│
├── 📚 Documentação
│   └── docs/
│       ├── DEPLOY_VERCEL.md        # Deploy no Vercel
│       ├── GUIA_TESTE.md           # Guia de testes
│       └── ...                     # Outros docs
│
├── 📊 Dados
│   └── data/
│       ├── exemplos/               # Exemplos (versionado)
│       └── resultados/             # Resultados (não versionado)
│
└── 🧪 Testes
    └── tests/
        └── testar_sistema.py       # Testes do sistema
```

## 🎯 Arquivos Importantes

### Para Desenvolvimento
- `package.json` - Dependências Node.js
- `requirements.txt` - Dependências Python
- `next.config.js` - Configuração Next.js
- `tsconfig.json` - Configuração TypeScript

### Para Deploy
- `vercel.json` - Configuração Vercel
- `.nvmrc` - Versão Node.js
- `.python-version` - Versão Python

### Para Git
- `.gitignore` - Arquivos ignorados
- `.gitattributes` - Atributos Git
- `README.md` - Documentação principal

## 📝 Notas

- ✅ Estrutura organizada e limpa
- ✅ Separação clara de responsabilidades
- ✅ Pronto para Git e Deploy
- ✅ Fácil manutenção

