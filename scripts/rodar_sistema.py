"""
Script para rodar o sistema após reorganização
"""

import sys
from pathlib import Path

# Adicionar src/core ao path
core_dir = Path(__file__).parent.parent / "src" / "core"
sys.path.insert(0, str(core_dir))

from sistema_analise_financeira import SistemaAnaliseFinanceira

if __name__ == "__main__":
    # Caminhos relativos à raiz do projeto
    planilha = Path(__file__).parent.parent / "data" / "resultados" / "MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx"
    historico = None  # Path(__file__).parent.parent / "data" / "exemplos" / "exemplo_historico.csv"
    saida = Path(__file__).parent.parent / "data" / "resultados" / "resultados_analise_financeira.xlsx"
    
    if not planilha.exists():
        print(f"❌ Planilha não encontrada: {planilha}")
        print("   Por favor, coloque a planilha na pasta data/resultados/")
        sys.exit(1)
    
    print("=" * 80)
    print("SISTEMA DE ANÁLISE FINANCEIRA")
    print("=" * 80)
    
    sistema = SistemaAnaliseFinanceira(str(planilha), str(historico) if historico else None)
    sistema.executar_pipeline_completo(str(saida))
    
    print(f"\nResultados salvos em: {saida}")

