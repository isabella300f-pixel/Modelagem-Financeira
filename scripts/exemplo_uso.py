"""
Exemplo de uso do Sistema de Análise Financeira
"""

from sistema_analise_financeira import SistemaAnaliseFinanceira

# ============================================================================
# CONFIGURAÇÃO
# ============================================================================

# Caminho da planilha Excel
PLANILHA = "MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx"

# Caminho da base histórica (opcional - deixe None se não tiver)
HISTORICO = None  # "exemplo_historico.csv" ou None

# Nome do arquivo de saída
SAIDA = "resultados_analise_financeira.xlsx"

# ============================================================================
# EXECUÇÃO
# ============================================================================

if __name__ == "__main__":
    print("=" * 80)
    print("EXEMPLO DE USO - SISTEMA DE ANÁLISE FINANCEIRA")
    print("=" * 80)
    
    # Criar instância do sistema
    sistema = SistemaAnaliseFinanceira(
        caminho_planilha=PLANILHA,
        caminho_historico=HISTORICO
    )
    
    # Executar pipeline completo
    sistema.executar_pipeline_completo(caminho_saida=SAIDA)
    
    print("\n" + "=" * 80)
    print("PRÓXIMOS PASSOS:")
    print("=" * 80)
    print("1. Abra o arquivo Excel gerado:", SAIDA)
    print("2. Verifique o relatório em: relatorio_analise.txt")
    print("3. Para dashboard interativo, execute: streamlit run dashboard_streamlit.py")
    print("=" * 80)

