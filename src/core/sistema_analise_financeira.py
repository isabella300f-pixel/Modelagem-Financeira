"""
Sistema Principal de Análise Financeira
Integra extração, processamento, geração de DRE e relatórios
"""

import pandas as pd
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Optional
import json
import warnings
warnings.filterwarnings('ignore')

import sys
from pathlib import Path

# Adicionar src/core ao path
core_dir = Path(__file__).parent
sys.path.insert(0, str(core_dir))

from extrator_planilha import ExtratorPlanilha
from gerador_dre import GeradorDRE
from gerador_dre import GeradorDRE


class SistemaAnaliseFinanceira:
    """Sistema completo de análise financeira com DRE e fallback histórico"""
    
    def __init__(
        self, 
        caminho_planilha: Optional[str] = None,
        caminho_historico: Optional[str] = None,
        mapeamento_path: Optional[str] = None
    ):
        # Definir caminho padrão do mapeamento
        if mapeamento_path is None:
            config_dir = Path(__file__).parent.parent.parent / "config"
            mapeamento_path = str(config_dir / "mapeamento_dre.json")
        
        self.caminho_planilha = caminho_planilha
        self.caminho_historico = caminho_historico
        # Extrator só é criado se houver caminho de planilha
        self.extrator = ExtratorPlanilha(caminho_planilha) if caminho_planilha else None
        self.gerador_dre = GeradorDRE(mapeamento_path)
        
        self.dados_atuais = None
        self.dados_historicos = None
        self.dados_mensais = None
        self.dados_preenchidos = None
        self.sources = None
        self.dre_mensal = None
        self.dre_trimestral = None
        self.dre_anual = None
        self.kpis = None
        self.flags = None
    
    def carregar_dados(self):
        """Carrega dados atuais e históricos"""
        # Se dados já foram carregados (ex: CSV manual ou mesclado), usar diretamente
        if self.dados_atuais is not None and not self.dados_atuais.empty:
            print(f"Dados já carregados: {len(self.dados_atuais)} registros")
            # Carregar histórico mesmo assim
            if self.caminho_historico and Path(self.caminho_historico).exists():
                print("Carregando dados históricos...")
                try:
                    self.dados_historicos = pd.read_csv(self.caminho_historico, parse_dates=['data'])
                    print(f"Dados históricos carregados: {len(self.dados_historicos)} registros")
                except Exception as e:
                    print(f"Erro ao carregar histórico: {e}")
                    self.dados_historicos = None
            return
        
        # Se não há extrator, não há como carregar
        if not self.extrator:
            if self.dados_atuais is None or self.dados_atuais.empty:
                print("Aviso: Nenhum caminho de planilha fornecido e dados não preenchidos. Usando DataFrame vazio.")
                self.dados_atuais = pd.DataFrame(columns=['data', 'categoria', 'valor', 'tipo', 'fonte', 'descricao'])
            return
        
        print("Carregando dados atuais...")
        try:
            self.dados_atuais = self.extrator.consolidar_dados()
            print(f"Dados atuais carregados: {len(self.dados_atuais)} registros")
            
            # Garantir que há dados válidos
            if self.dados_atuais is None or self.dados_atuais.empty:
                print("Aviso: Nenhum dado foi extraído da planilha.")
                self.dados_atuais = pd.DataFrame(columns=['data', 'categoria', 'valor', 'tipo', 'fonte', 'descricao'])
        except Exception as e:
            print(f"Erro ao carregar dados atuais: {e}")
            self.dados_atuais = pd.DataFrame(columns=['data', 'categoria', 'valor', 'tipo', 'fonte', 'descricao'])
        
        if self.caminho_historico and Path(self.caminho_historico).exists():
            print("Carregando dados históricos...")
            try:
                self.dados_historicos = pd.read_csv(self.caminho_historico, parse_dates=['data'])
                print(f"Dados históricos carregados: {len(self.dados_historicos)} registros")
            except Exception as e:
                print(f"Erro ao carregar histórico: {e}")
                self.dados_historicos = None
        else:
            print("Nenhum arquivo histórico encontrado. Usando apenas dados atuais.")
            self.dados_historicos = None
    
    def processar_dados(self):
        """Processa dados e aplica lógica de fallback"""
        print("\nProcessando dados...")
        
        # Verificar se há dados para processar
        if self.dados_atuais is None or self.dados_atuais.empty:
            print("ERRO: Nenhum dado atual disponível para processar!")
            self.dados_mensais = pd.DataFrame()
            self.dados_preenchidos = pd.DataFrame()
            self.sources = pd.DataFrame()
            self.flags = pd.DataFrame()
            return
        
        print(f"Dados atuais para processar: {len(self.dados_atuais)} registros")
        print(f"Colunas disponíveis: {list(self.dados_atuais.columns)}")
        print(f"Primeiras linhas:\n{self.dados_atuais.head()}")
        
        # Pivotar para formato mensal
        self.dados_mensais = self.gerador_dre.pivotar_mensal(self.dados_atuais)
        print(f"Dados mensais: {self.dados_mensais.shape}")
        if not self.dados_mensais.empty:
            print(f"Colunas mensais: {list(self.dados_mensais.columns)}")
            print(f"Primeiras linhas mensais:\n{self.dados_mensais.head()}")
        
        # Calcular coverage
        coverage = self.gerador_dre.calcular_coverage(self.dados_mensais)
        print(f"\nCoverage por categoria:")
        for cat, cov in coverage.items():
            print(f"  {cat}: {cov:.2%}")
        
        # Preencher com histórico
        print("\nAplicando lógica de fallback...")
        self.dados_preenchidos, self.sources = self.gerador_dre.preencher_com_historico(
            self.dados_mensais,
            self.dados_historicos,
            coverage
        )
        
        print(f"Dados preenchidos: {self.dados_preenchidos.shape}")
        if not self.dados_preenchidos.empty:
            print(f"Colunas preenchidas: {list(self.dados_preenchidos.columns)}")
        
        # Gerar flags
        self.flags = self.gerador_dre.gerar_flags_coverage(coverage)
        
        print("Processamento concluído!")
    
    def gerar_dres(self):
        """Gera DREs mensal, trimestral e anual"""
        print("\nGerando DREs...")
        
        if self.dados_preenchidos is None or self.dados_preenchidos.empty:
            print("ERRO: Nenhum dado preenchido disponível para gerar DRE!")
            self.dre_mensal = pd.DataFrame()
            self.dre_trimestral = pd.DataFrame()
            self.dre_anual = pd.DataFrame()
            self.kpis = pd.DataFrame()
            return
        
        self.dre_mensal = self.gerador_dre.gerar_dre(self.dados_preenchidos, periodo='mensal')
        print(f"DRE Mensal: {self.dre_mensal.shape}")
        if not self.dre_mensal.empty:
            print(f"Colunas DRE: {list(self.dre_mensal.columns)}")
            print(f"Primeiras linhas DRE:\n{self.dre_mensal.head()}")
        
        self.dre_trimestral = self.gerador_dre.gerar_dre(self.dados_preenchidos, periodo='trimestral')
        print(f"DRE Trimestral: {self.dre_trimestral.shape}")
        
        self.dre_anual = self.gerador_dre.gerar_dre(self.dados_preenchidos, periodo='anual')
        print(f"DRE Anual: {self.dre_anual.shape}")
        
        # Gerar KPIs
        if not self.dre_mensal.empty:
            self.kpis = self.gerador_dre.gerar_kpis(self.dre_mensal)
            print(f"KPIs: {self.kpis.shape}")
            if not self.kpis.empty:
                print(f"Colunas KPIs: {list(self.kpis.columns)}")
                print(f"Primeiras linhas KPIs:\n{self.kpis.head()}")
        else:
            self.kpis = pd.DataFrame()
            print("ERRO: DRE mensal vazio, não é possível gerar KPIs!")
    
    def exportar_resultados(self, caminho_saida: str = "resultados_analise.xlsx"):
        """Exporta todos os resultados para Excel"""
        print(f"\nExportando resultados para {caminho_saida}...")
        
        with pd.ExcelWriter(caminho_saida, engine='openpyxl') as writer:
            # DREs
            if self.dre_mensal is not None and not self.dre_mensal.empty:
                self.dre_mensal.to_excel(writer, sheet_name='DRE_Mensal')
            
            if self.dre_trimestral is not None and not self.dre_trimestral.empty:
                self.dre_trimestral.to_excel(writer, sheet_name='DRE_Trimestral')
            
            if self.dre_anual is not None and not self.dre_anual.empty:
                self.dre_anual.to_excel(writer, sheet_name='DRE_Anual')
            
            # KPIs
            if self.kpis is not None and not self.kpis.empty:
                self.kpis.to_excel(writer, sheet_name='KPIs')
            
            # Dados processados
            if self.dados_mensais is not None and not self.dados_mensais.empty:
                self.dados_mensais.to_excel(writer, sheet_name='Dados_Mensais_Raw')
            
            if self.dados_preenchidos is not None and not self.dados_preenchidos.empty:
                self.dados_preenchidos.to_excel(writer, sheet_name='Dados_Mensais_Preenchidos')
            
            if self.sources is not None and not self.sources.empty:
                self.sources.to_excel(writer, sheet_name='Sources_Audit_Trail')
            
            # Flags
            if self.flags is not None and not self.flags.empty:
                self.flags.to_excel(writer, sheet_name='Flags_Coverage')
            
            # Dados originais
            if self.dados_atuais is not None and not self.dados_atuais.empty:
                self.dados_atuais.to_excel(writer, sheet_name='Dados_Originais')
        
        print(f"Resultados exportados com sucesso!")
    
    def gerar_relatorio_texto(self) -> str:
        """Gera relatório em texto"""
        relatorio = []
        relatorio.append("=" * 80)
        relatorio.append("RELATÓRIO DE ANÁLISE FINANCEIRA")
        relatorio.append("=" * 80)
        relatorio.append(f"\nData de geração: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        
        # Resumo de dados
        relatorio.append("\n" + "-" * 80)
        relatorio.append("RESUMO DE DADOS")
        relatorio.append("-" * 80)
        relatorio.append(f"Registros processados: {len(self.dados_atuais) if self.dados_atuais is not None else 0}")
        relatorio.append(f"Meses com dados: {len(self.dados_mensais.index) if self.dados_mensais is not None else 0}")
        
        # Flags de coverage
        if self.flags is not None and not self.flags.empty:
            relatorio.append("\n" + "-" * 80)
            relatorio.append("STATUS DE COVERAGE POR CATEGORIA")
            relatorio.append("-" * 80)
            for categoria, row in self.flags.iterrows():
                status = row['status']
                coverage = row['coverage_pct']
                cor = row['cor']
                relatorio.append(f"{categoria}: {status} ({coverage:.1%}) [{cor}]")
        
        # Resumo DRE Anual
        if self.dre_anual is not None and not self.dre_anual.empty:
            relatorio.append("\n" + "-" * 80)
            relatorio.append("DRE ANUAL - RESUMO")
            relatorio.append("-" * 80)
            for ano in self.dre_anual.index:
                relatorio.append(f"\nAno: {ano}")
                receita_liq = self.dre_anual.loc[ano, 'Receita Líquida'] if 'Receita Líquida' in self.dre_anual.columns else 0
                lucro_bruto = self.dre_anual.loc[ano, 'Lucro Bruto'] if 'Lucro Bruto' in self.dre_anual.columns else 0
                ebitda = self.dre_anual.loc[ano, 'EBITDA'] if 'EBITDA' in self.dre_anual.columns else 0
                resultado_liq = self.dre_anual.loc[ano, 'Resultado Líquido'] if 'Resultado Líquido' in self.dre_anual.columns else 0
                
                relatorio.append(f"  Receita Líquida: R$ {receita_liq:,.2f}")
                relatorio.append(f"  Lucro Bruto: R$ {lucro_bruto:,.2f}")
                relatorio.append(f"  EBITDA: R$ {ebitda:,.2f}")
                relatorio.append(f"  Resultado Líquido: R$ {resultado_liq:,.2f}")
        
        # KPIs
        if self.kpis is not None and not self.kpis.empty:
            relatorio.append("\n" + "-" * 80)
            relatorio.append("KPIs - ÚLTIMO PERÍODO")
            relatorio.append("-" * 80)
            ultimo_periodo = self.kpis.index[-1] if len(self.kpis) > 0 else None
            if ultimo_periodo:
                for kpi in self.kpis.columns:
                    valor = self.kpis.loc[ultimo_periodo, kpi]
                    relatorio.append(f"{kpi}: {valor:.2f}%")
        
        relatorio.append("\n" + "=" * 80)
        
        return "\n".join(relatorio)
    
    def executar_pipeline_completo(self, caminho_saida: str = "resultados_analise.xlsx"):
        """Executa pipeline completo: carregar -> processar -> gerar -> exportar"""
        print("=" * 80)
        print("SISTEMA DE ANÁLISE FINANCEIRA - PIPELINE COMPLETO")
        print("=" * 80)
        
        try:
            self.carregar_dados()
            self.processar_dados()
            self.gerar_dres()
            self.exportar_resultados(caminho_saida)
            
            # Gerar relatório texto
            relatorio = self.gerar_relatorio_texto()
            print("\n" + relatorio)
            
            # Salvar relatório
            with open("relatorio_analise.txt", "w", encoding="utf-8") as f:
                f.write(relatorio)
            
            print("\n" + "=" * 80)
            print("PIPELINE CONCLUÍDO COM SUCESSO!")
            print("=" * 80)
            
        except Exception as e:
            print(f"\nERRO no pipeline: {e}")
            import traceback
            traceback.print_exc()
            raise


if __name__ == "__main__":
    # Configuração
    PLANILHA = "MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx"
    HISTORICO = None  # "historical.csv" se tiver base histórica
    SAIDA = "resultados_analise_financeira.xlsx"
    
    # Executar
    sistema = SistemaAnaliseFinanceira(PLANILHA, HISTORICO)
    sistema.executar_pipeline_completo(SAIDA)

