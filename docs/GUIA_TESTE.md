# 🧪 Guia de Teste - Sistema de Análise Financeira

## ✅ Teste Rápido (Já Executado)

O sistema foi testado com sucesso! Veja os resultados abaixo.

## 📋 Formas de Testar

### 1️⃣ Teste Automatizado (Recomendado)

Execute o script de teste completo:

```bash
python testar_sistema.py
```

**O que ele faz:**
- ✅ Verifica se a planilha existe
- ✅ Testa importação de módulos
- ✅ Extrai dados da planilha
- ✅ Gera DRE
- ✅ Executa pipeline completo
- ✅ Verifica arquivos gerados

**Resultado esperado:**
```
✅ Sistema testado com sucesso!
Arquivos gerados:
- teste_resultados.xlsx
- relatorio_analise.txt
```

### 2️⃣ Teste Manual - Pipeline Completo

Execute o sistema principal:

```bash
python sistema_analise_financeira.py
```

**Ou use o exemplo:**

```bash
python exemplo_uso.py
```

**Resultado:**
- Arquivo Excel: `resultados_analise_financeira.xlsx`
- Relatório texto: `relatorio_analise.txt`

### 3️⃣ Teste Interativo - Dashboard Web

Inicie o dashboard:

```bash
streamlit run dashboard_streamlit.py
```

**No navegador:**
1. Faça upload da planilha Excel
2. (Opcional) Faça upload de base histórica CSV
3. Clique em "🔄 Processar Dados"
4. Explore as abas:
   - 📈 Dashboard
   - 💰 DRE
   - 🎯 KPIs
   - 🚦 Flags & Coverage
   - 📥 Exportar

### 4️⃣ Teste por Módulos

#### Teste do Extrator

```python
from extrator_planilha import ExtratorPlanilha

extrator = ExtratorPlanilha("sua_planilha.xlsx")
dados = extrator.consolidar_dados()
print(f"Registros extraídos: {len(dados)}")
print(dados.head())
```

#### Teste do Gerador DRE

```python
from gerador_dre import GeradorDRE
import pandas as pd

gerador = GeradorDRE()
# Use dados extraídos
dre = gerador.gerar_dre(dados_mensais, periodo='mensal')
print(dre)
```

## 📊 Verificar Resultados

### Arquivo Excel Gerado

Abra `teste_resultados.xlsx` ou `resultados_analise_financeira.xlsx` e verifique as abas:

1. **DRE_Mensal**: DRE mês a mês
2. **DRE_Trimestral**: DRE por trimestre
3. **DRE_Anual**: DRE por ano
4. **KPIs**: Indicadores calculados
5. **Flags_Coverage**: Status de qualidade
6. **Sources_Audit_Trail**: Origem dos dados

### Relatório Texto

Abra `relatorio_analise.txt` para ver:
- Resumo de dados processados
- Status de coverage
- DRE anual consolidado
- KPIs

## 🔍 O que Verificar

### ✅ Testes Bem-Sucedidos

- [x] Planilha é encontrada e lida
- [x] Dados são extraídos (600 registros no teste)
- [x] DRE é gerado (60 meses, 15 linhas)
- [x] KPIs são calculados
- [x] Arquivos são exportados
- [x] Coverage é calculado (100% no teste)

### ⚠️ Possíveis Problemas

#### "Planilha não encontrada"
- Verifique se o arquivo está na pasta correta
- Verifique o nome do arquivo

#### "Nenhum dado extraído"
- Verifique se as abas têm os nomes corretos
- Ajuste o extrator em `extrator_planilha.py`

#### "DRE com valores zerados"
- Verifique o mapeamento em `mapeamento_dre.json`
- Confira se as categorias estão sendo encontradas

## 📈 Resultados do Último Teste

```
✅ Dados extraídos: 600 registros
✅ Período: 2020-01-01 até 2024-12-01
✅ Categorias: Telecomunicações, Administrativo, Outras Despesas, Utilidades, Manutenção
✅ DRE Mensal: 60 meses x 15 linhas
✅ DRE Trimestral: 20 trimestres x 15 linhas
✅ DRE Anual: 5 anos x 15 linhas
✅ KPIs: 60 períodos x 4 indicadores
✅ Coverage: 100% (todas as categorias)
```

## 🚀 Próximos Passos Após Teste

1. **Abrir Excel**: Verifique os resultados em `teste_resultados.xlsx`
2. **Ler Relatório**: Confira `relatorio_analise.txt`
3. **Ajustar Configuração**: Edite `mapeamento_dre.json` se necessário
4. **Adicionar Histórico**: Crie CSV histórico para melhorar fallback
5. **Usar Dashboard**: Execute `streamlit run dashboard_streamlit.py`

## 💡 Dicas

- Use o dashboard para visualização interativa
- Ajuste os thresholds de coverage em `gerador_dre.py` se necessário
- Adicione mais categorias em `mapeamento_dre.json` conforme sua necessidade
- O sistema funciona mesmo sem base histórica (usa apenas dados atuais)

## ❓ Problemas?

1. Verifique os logs de erro
2. Confira o arquivo `relatorio_analise.txt`
3. Veja a aba "Sources_Audit_Trail" no Excel
4. Execute `python testar_sistema.py` para diagnóstico completo

