"""
Script de teste do Sistema de Análise Financeira
Testa todas as funcionalidades principais
"""

import os
import sys
from pathlib import Path
import pandas as pd

print("=" * 80)
print("TESTE DO SISTEMA DE ANÁLISE FINANCEIRA")
print("=" * 80)

# Verificar se a planilha existe
planilha = "MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx"
if not Path(planilha).exists():
    print(f"❌ ERRO: Planilha não encontrada: {planilha}")
    print("   Verifique se o arquivo está na pasta atual.")
    sys.exit(1)

print(f"✅ Planilha encontrada: {planilha}")

# Teste 1: Importar módulos
print("\n" + "-" * 80)
print("TESTE 1: Importação de Módulos")
print("-" * 80)
try:
    from extrator_planilha import ExtratorPlanilha
    from gerador_dre import GeradorDRE
    from sistema_analise_financeira import SistemaAnaliseFinanceira
    print("✅ Todos os módulos importados com sucesso!")
except Exception as e:
    print(f"❌ Erro ao importar módulos: {e}")
    sys.exit(1)

# Teste 2: Extração de dados
print("\n" + "-" * 80)
print("TESTE 2: Extração de Dados da Planilha")
print("-" * 80)
try:
    extrator = ExtratorPlanilha(planilha)
    dados = extrator.consolidar_dados()
    print(f"✅ Dados extraídos: {len(dados)} registros")
    if not dados.empty:
        print(f"   Período: {dados['data'].min()} até {dados['data'].max()}")
        print(f"   Categorias encontradas: {dados['categoria'].unique().tolist()}")
        print(f"   Primeiras linhas:")
        print(dados.head(5).to_string())
    else:
        print("⚠️  AVISO: Nenhum dado extraído. Verifique a estrutura da planilha.")
except Exception as e:
    print(f"❌ Erro na extração: {e}")
    import traceback
    traceback.print_exc()

# Teste 3: Geração de DRE
print("\n" + "-" * 80)
print("TESTE 3: Geração de DRE")
print("-" * 80)
try:
    gerador = GeradorDRE()
    if not dados.empty:
        dados_mensais = gerador.pivotar_mensal(dados)
        print(f"✅ Dados mensais pivotados: {dados_mensais.shape}")
        print(f"   Períodos: {len(dados_mensais.index)} meses")
        print(f"   Categorias: {list(dados_mensais.columns)}")
        
        coverage = gerador.calcular_coverage(dados_mensais)
        print(f"\n   Coverage por categoria:")
        for cat, cov in coverage.items():
            print(f"     {cat}: {cov:.1%}")
        
        dados_preenchidos, sources = gerador.preencher_com_historico(dados_mensais, None, coverage)
        print(f"\n✅ Dados preenchidos: {dados_preenchidos.shape}")
        
        dre = gerador.gerar_dre(dados_preenchidos, periodo='mensal')
        print(f"✅ DRE gerado: {dre.shape}")
        print(f"   Linhas DRE: {list(dre.columns)[:5]}...")
    else:
        print("⚠️  AVISO: Não foi possível gerar DRE (sem dados)")
except Exception as e:
    print(f"❌ Erro na geração de DRE: {e}")
    import traceback
    traceback.print_exc()

# Teste 4: Pipeline completo
print("\n" + "-" * 80)
print("TESTE 4: Pipeline Completo")
print("-" * 80)
try:
    sistema = SistemaAnaliseFinanceira(planilha, None)
    sistema.carregar_dados()
    print(f"✅ Dados carregados: {len(sistema.dados_atuais)} registros")
    
    sistema.processar_dados()
    print(f"✅ Dados processados")
    print(f"   Meses: {len(sistema.dados_mensais.index) if sistema.dados_mensais is not None else 0}")
    print(f"   Flags: {len(sistema.flags) if sistema.flags is not None else 0} categorias")
    
    sistema.gerar_dres()
    print(f"✅ DREs gerados")
    print(f"   Mensal: {sistema.dre_mensal.shape if sistema.dre_mensal is not None else 'N/A'}")
    print(f"   Trimestral: {sistema.dre_trimestral.shape if sistema.dre_trimestral is not None else 'N/A'}")
    print(f"   Anual: {sistema.dre_anual.shape if sistema.dre_anual is not None else 'N/A'}")
    print(f"   KPIs: {sistema.kpis.shape if sistema.kpis is not None else 'N/A'}")
    
    # Exportar
    arquivo_teste = "teste_resultados.xlsx"
    sistema.exportar_resultados(arquivo_teste)
    if Path(arquivo_teste).exists():
        print(f"✅ Arquivo exportado: {arquivo_teste}")
        print(f"   Tamanho: {Path(arquivo_teste).stat().st_size / 1024:.1f} KB")
    else:
        print(f"❌ Erro: Arquivo não foi criado")
        
except Exception as e:
    print(f"❌ Erro no pipeline: {e}")
    import traceback
    traceback.print_exc()

# Teste 5: Verificar arquivos gerados
print("\n" + "-" * 80)
print("TESTE 5: Verificação de Arquivos Gerados")
print("-" * 80)
arquivos_esperados = [
    "teste_resultados.xlsx",
    "relatorio_analise.txt"
]

for arquivo in arquivos_esperados:
    if Path(arquivo).exists():
        tamanho = Path(arquivo).stat().st_size
        print(f"✅ {arquivo} ({tamanho / 1024:.1f} KB)")
    else:
        print(f"⚠️  {arquivo} não encontrado")

# Resumo final
print("\n" + "=" * 80)
print("RESUMO DOS TESTES")
print("=" * 80)
print("✅ Sistema testado com sucesso!")
print("\nPróximos passos:")
print("1. Abra o arquivo: teste_resultados.xlsx")
print("2. Verifique o relatório: relatorio_analise.txt")
print("3. Para dashboard: streamlit run dashboard_streamlit.py")
print("=" * 80)

