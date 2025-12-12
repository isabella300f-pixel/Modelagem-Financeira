# 300F - Sistema de Gestão de Performance para Franqueados

Sistema web completo para aceleradora de franquias, oferecendo gestão integrada de franqueados com análise financeira, documentos, treinamentos, comunicação e operações.

## 🚀 Características Principais

### Análise Financeira
- **Extração de Dados**: Processa planilhas Excel complexas automaticamente
- **Geração de DRE**: DRE mensal, trimestral e anual
- **Cálculo de KPIs**: Margem Bruta, Margem EBITDA, Margem Líquida, ROI
- **Fallback Inteligente**: Usa dados históricos quando necessário
- **Interface Web Moderna**: Dashboard interativo com gráficos
- **Entrada Manual**: Permite adicionar dados manualmente quando não há arquivo
- **Exportação**: Exporta resultados em Excel/CSV

### Gestão de Franqueados
- **Perfil Completo**: Dados cadastrais, informações da unidade, indicadores
- **Documentos**: Repositório com controle de versões e alertas de vencimento
- **Treinamentos**: Trilhas de aprendizado com progresso e materiais
- **Comunicação**: Chat, chamados, agendamentos e comunicados
- **Gestão Operacional**: Checklists, evidências e relatórios
- **Painel Gerencial**: Visão geral com ranking e comparativos

## 📁 Estrutura do Projeto

```
projeto/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── comunicacao/       # Módulo de comunicação
│   ├── documentos/        # Gestão de documentos
│   ├── operacional/       # Gestão operacional
│   ├── painel-gerencial/  # Painel administrativo
│   ├── perfil/            # Perfil do franqueado
│   ├── planilhas/         # Análise financeira
│   └── treinamentos/      # Sistema de treinamentos
├── components/            # Componentes React
├── src/core/             # Módulos Python (análise financeira)
├── scripts/              # Scripts Python
└── docs/                 # Documentação
```

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Python >= 3.8
- pip

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd "Modelagem Financeira"
```

### 2. Instale dependências Node.js

```bash
npm install
```

### 3. Instale dependências Python

```bash
pip install -r requirements.txt
```

## ▶️ Como Usar

### Executar Localmente

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

### Processar Planilha

1. Acesse a interface web
2. Faça upload de uma planilha Excel (ou insira dados manualmente)
3. Clique em "Processar"
4. Visualize os resultados no Dashboard, DRE, KPIs e Gráficos
5. Exporte os resultados se necessário

### Usar via Script Python

```bash
python scripts/rodar_sistema.py
```

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── core/                    # Lógica principal Python
│   │   ├── extrator_planilha.py    # Extração de dados
│   │   ├── gerador_dre.py          # Geração de DRE
│   │   └── sistema_analise_financeira.py  # Orquestrador
│   └── web/                     # Aplicação Next.js
│       ├── app/                 # Rotas e páginas
│       └── components/          # Componentes React
├── scripts/
│   └── processar_api.py        # API de processamento
├── config/
│   └── mapeamento_dre.json     # Mapeamento de categorias DRE
├── data/
│   ├── exemplos/               # Arquivos de exemplo
│   └── resultados/             # Resultados gerados (gitignored)
└── docs/                       # Documentação
```

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Python 3.8+, pandas, openpyxl
- **Gráficos**: Recharts
- **Deploy**: Vercel (compatível)

## 📝 Configuração

### Mapeamento DRE

O arquivo `config/mapeamento_dre.json` define como as categorias da planilha são mapeadas para as linhas do DRE. Edite conforme necessário.

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente para execução local.

## 🚢 Deploy

### Vercel

O projeto está configurado para deploy no Vercel. Basta fazer push para o Git e conectar ao Vercel.

```bash
# Build de produção
npm run build

# Testar build localmente
npm start
```

## 📊 Formatos Suportados

- **Entrada**: Excel (.xlsx), dados manuais
- **Saída**: Excel (.xlsx), CSV, JSON

## 🔍 Funcionalidades Principais

### Extração de Dados
- Processa múltiplas abas da planilha
- Identifica receitas do "Fluxo de Caixa"
- Extrai despesas de "Despesas Mensais"
- Suporta estrutura complexa de planilhas

### Geração de DRE
- Receita Bruta e Líquida
- COGS e Lucro Bruto
- Despesas Operacionais detalhadas
- EBITDA e Resultado Líquido
- Agregação mensal, trimestral e anual

### Fallback Histórico
- Calcula cobertura de dados
- Preenche lacunas com dados históricos
- Imputa valores faltantes inteligentemente
- Gera flags de qualidade de dados

## 📄 Licença

Este projeto é privado e confidencial.

## 🤝 Contribuindo

Este é um projeto privado. Para questões ou melhorias, entre em contato com a equipe de desenvolvimento.

## 📞 Suporte

Para problemas ou dúvidas, consulte a documentação em `docs/` ou entre em contato com o time de desenvolvimento.
