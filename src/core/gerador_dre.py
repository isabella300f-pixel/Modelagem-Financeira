"""
Módulo para geração de DRE (Demonstração do Resultado do Exercício)
com lógica de fallback histórico
"""

import pandas as pd
import numpy as np
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from pathlib import Path


class GeradorDRE:
    """Gera DRE mensal/trimestral/anual com lógica de fallback histórico"""
    
    def __init__(self, mapeamento_path: Optional[str] = None):
        # Definir caminho padrão do mapeamento
        if mapeamento_path is None:
            from pathlib import Path
            config_dir = Path(__file__).parent.parent.parent / "config"
            mapeamento_path = str(config_dir / "mapeamento_dre.json")
        
        with open(mapeamento_path, 'r', encoding='utf-8') as f:
            self.mapeamento = json.load(f)
        
        self.coverage_threshold_full = 0.75
        self.coverage_threshold_partial = 0.40
        self.expected_months = 12
    
    def pivotar_mensal(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Pivota dados para formato mensal por categoria
        Retorna DataFrame com índice year_month e colunas por categoria
        """
        if df.empty:
            return pd.DataFrame()
        
        df = df.copy()
        df['year_month'] = df['data'].dt.to_period('M').astype(str)
        
        # Agrupar por mês e categoria usando o mapeamento
        pivot_data = []
        
        for _, row in df.iterrows():
            categoria_orig = row.get('categoria', '')
            valor = row.get('valor', 0)
            year_month = row.get('year_month', '')
            
            if pd.isna(valor) or valor == 0:
                continue
            
            # Mapear categoria original para categoria DRE
            categoria_dre = self._mapear_categoria_dre(categoria_orig)
            
            pivot_data.append({
                'year_month': year_month,
                'categoria_dre': categoria_dre,
                'valor': float(valor)
            })
        
        if not pivot_data:
            return pd.DataFrame()
        
        df_pivot = pd.DataFrame(pivot_data)
        df_monthly = df_pivot.groupby(['year_month', 'categoria_dre'])['valor'].sum().unstack(fill_value=0)
        
        return df_monthly
    
    def _mapear_categoria_dre(self, categoria_orig: str) -> str:
        """Mapeia categoria original para categoria DRE"""
        mapeamento = self.mapeamento.get('mapeamento_categorias', {})
        if categoria_orig in mapeamento:
            categoria_dre = mapeamento[categoria_orig].get('categoria_dre', categoria_orig)
            # Se categoria_dre é None ou vazio, usar a original
            if not categoria_dre or categoria_dre == '':
                return categoria_orig
            return categoria_dre
        # Se não encontrar no mapeamento, retornar a categoria original
        return categoria_orig
    
    def calcular_coverage(self, df_monthly: pd.DataFrame, expected_months: Optional[int] = None) -> Dict[str, float]:
        """
        Calcula coverage (cobertura) por categoria
        Retorna dict com categoria -> coverage_pct
        """
        if df_monthly.empty:
            return {}
        
        expected = expected_months or self.expected_months
        coverage = {}
        
        for col in df_monthly.columns:
            # Contar meses com dados válidos (não-zero)
            nonzero_months = (df_monthly[col] != 0).sum()
            total_months = len(df_monthly.index)
            coverage[col] = nonzero_months / max(expected, total_months)
        
        return coverage
    
    def preencher_com_historico(
        self, 
        df_monthly: pd.DataFrame, 
        df_historico: Optional[pd.DataFrame] = None,
        coverage: Optional[Dict[str, float]] = None
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Preenche dados faltantes usando histórico
        Retorna: (df_preenchido, df_sources)
        """
        if df_monthly.empty:
            return pd.DataFrame(), pd.DataFrame()
        
        df_filled = df_monthly.copy()
        df_sources = pd.DataFrame(index=df_monthly.index, columns=df_monthly.columns)
        df_sources = df_sources.fillna('')
        
        if coverage is None:
            coverage = self.calcular_coverage(df_monthly)
        
        # Processar histórico se disponível
        hist_monthly = None
        if df_historico is not None and not df_historico.empty:
            hist_monthly = self.pivotar_mensal(df_historico)
        
        # Preencher cada categoria
        for col in df_monthly.columns:
            cov = coverage.get(col, 0)
            
            # Calcular média histórica se disponível
            hist_mean = None
            if hist_monthly is not None and col in hist_monthly.columns:
                hist_mean = hist_monthly[col].mean()
            
            # Preencher valores faltantes
            for idx in df_monthly.index:
                valor_atual = df_monthly.at[idx, col]
                
                if valor_atual != 0:
                    df_sources.at[idx, col] = 'current'
                else:
                    # Decidir estratégia de preenchimento baseado no coverage
                    if cov >= self.coverage_threshold_full:
                        # Coverage alto: usar último valor conhecido ou média histórica
                        valores_nao_zero = df_monthly[col][df_monthly[col] != 0]
                        if not valores_nao_zero.empty:
                            valor = valores_nao_zero.iloc[-1]
                            df_sources.at[idx, col] = 'imputed_last_known'
                        elif hist_mean is not None:
                            valor = hist_mean
                            df_sources.at[idx, col] = 'imputed_historical_avg'
                        else:
                            valor = 0
                            df_sources.at[idx, col] = 'missing'
                    
                    elif cov >= self.coverage_threshold_partial:
                        # Coverage parcial: usar média histórica
                        if hist_mean is not None:
                            valor = hist_mean
                            df_sources.at[idx, col] = 'mixed_historical'
                        else:
                            # Calcular média dos valores existentes
                            valores_nao_zero = df_monthly[col][df_monthly[col] != 0]
                            valor = valores_nao_zero.mean() if not valores_nao_zero.empty else 0
                            df_sources.at[idx, col] = 'mixed_current_avg'
                    
                    else:
                        # Coverage baixo: fallback histórico completo
                        if hist_mean is not None:
                            valor = hist_mean
                            df_sources.at[idx, col] = 'historical_fallback'
                        else:
                            valor = 0
                            df_sources.at[idx, col] = 'missing'
                    
                    df_filled.at[idx, col] = valor
        
        return df_filled, df_sources
    
    def gerar_dre(
        self, 
        df_preenchido: pd.DataFrame,
        periodo: str = 'mensal'  # 'mensal', 'trimestral', 'anual'
    ) -> pd.DataFrame:
        """
        Gera DRE a partir dos dados preenchidos
        """
        if df_preenchido.empty:
            return pd.DataFrame()
        
        estrutura = self.mapeamento.get('estrutura_dre', [])
        
        # IMPORTANTE: Manter o índice original como está para garantir alinhamento
        # Não converter para DatetimeIndex ainda - isso será feito só no final se necessário
        df_work = df_preenchido.copy()
        index_original = df_work.index.copy()
        
        # Criar DRE com o mesmo índice
        dre = pd.DataFrame(index=df_work.index)
        
        # Calcular cada linha do DRE
        for item in sorted(estrutura, key=lambda x: x.get('ordem', 0)):
            linha = item['linha']
            tipo = item.get('tipo', '')
            formula = item.get('formula', '')
            
            if tipo == 'calculado':
                # Calcular baseado na fórmula
                valor = self._calcular_formula(formula, dre, df_work)
            elif linha in df_work.columns:
                # Se a linha já existe como coluna no df_preenchido, usar diretamente
                valor = df_work[linha].fillna(0)
            elif formula and formula.startswith('SUM'):
                # Se tem fórmula SUM, processar a fórmula
                valor = self._processar_formula_sum(formula, df_work)
            else:
                # Buscar valor dos dados preenchidos usando mapeamento
                valor = self._buscar_valor_categoria(linha, df_work)
            
            # Garantir que valor é uma Series com o índice correto
            if not isinstance(valor, pd.Series):
                valor = pd.Series(valor if isinstance(valor, (int, float)) else 0, index=df_work.index)
            
            # Garantir que o índice está alinhado (usar o índice do df_work)
            # Verificar se os índices são compatíveis antes de reindex
            try:
                # Tentar usar diretamente se os índices são iguais
                if valor.index.equals(df_work.index):
                    dre[linha] = valor.fillna(0)
                else:
                    # Se não são iguais, fazer reindex
                    valor_aligned = valor.reindex(df_work.index, fill_value=0)
                    dre[linha] = valor_aligned.fillna(0)
            except Exception as e:
                # Em caso de erro, criar Series do zero
                print(f"Erro ao alinhar valor para {linha}: {e}")
                dre[linha] = pd.Series(0.0, index=df_work.index)
        
        # Agrupar por período se necessário
        if periodo == 'trimestral':
            # Para trimestral, precisa converter para DatetimeIndex temporariamente
            dre_temp = dre.copy()
            if isinstance(dre_temp.index[0], str):
                dre_temp.index = pd.to_datetime(dre_temp.index, errors='coerce')
            dre = self._agrupar_trimestral(dre_temp)
        elif periodo == 'anual':
            # Para anual, precisa converter para DatetimeIndex temporariamente
            dre_temp = dre.copy()
            if isinstance(dre_temp.index[0], str):
                dre_temp.index = pd.to_datetime(dre_temp.index, errors='coerce')
            dre = self._agrupar_anual(dre_temp)
        # Para mensal, manter o índice como está (já está como string 'YYYY-MM')
        
        return dre
    
    def _calcular_formula(self, formula: str, dre: pd.DataFrame, df_preenchido: pd.DataFrame) -> pd.Series:
        """Calcula valor baseado em fórmula"""
        # Implementação simplificada - pode ser expandida
        formula_lower = formula.lower()
        
        # Função auxiliar para buscar coluna do DRE com fallback
        def get_dre_col(col_name, alt_names=None):
            if col_name in dre.columns:
                return dre[col_name].fillna(0)
            if alt_names:
                if isinstance(alt_names, str):
                    alt_names = [alt_names]
                elif not isinstance(alt_names, list):
                    alt_names = []
                for alt in alt_names:
                    if alt in dre.columns:
                        return dre[alt].fillna(0)
            return pd.Series(0.0, index=dre.index)
        
        if 'receita bruta - deduções' in formula_lower or ('receita bruta' in formula_lower and 'deduções' in formula_lower):
            receita_bruta = get_dre_col('Receita Bruta')
            deducoes = get_dre_col('Deduções (Impostos)', ['Deduções', 'Impostos'])
            return receita_bruta - deducoes
        elif 'receita líquida - cogs' in formula_lower or 'receita liquida - cogs' in formula_lower or ('receita liquida' in formula_lower and 'cogs' in formula_lower):
            receita_liq = get_dre_col('Receita Líquida', ['Receita Liquida'])
            cogs = get_dre_col('COGS', ['Custo dos Serviços/Vendas (COGS)'])
            return receita_liq - cogs
        elif 'lucro bruto - total despesas' in formula_lower or ('lucro bruto' in formula_lower and 'total despesas' in formula_lower):
            lucro_bruto = get_dre_col('Lucro Bruto')
            total_despesas = get_dre_col('Total Despesas Operacionais')
            return lucro_bruto - total_despesas
        elif 'ebitda - d&a' in formula_lower or 'ebitda - d/a' in formula_lower or ('ebitda' in formula_lower and 'd&a' in formula_lower):
            ebitda = get_dre_col('EBITDA')
            da = get_dre_col('D&A (Depreciação/Amortização)', ['D&A', 'Depreciação'])
            return ebitda - da
        elif 'resultado operacional - impostos' in formula_lower or ('resultado operacional' in formula_lower and 'impostos' in formula_lower):
            resultado_op = get_dre_col('Resultado Operacional')
            impostos = get_dre_col('Impostos sobre Lucro', ['Impostos'])
            return resultado_op - impostos
        elif 'despesas pessoal + despesas operacionais' in formula_lower or ('total despesas' in formula_lower and 'operacionais' in formula_lower):
            pessoal = get_dre_col('Despesas Pessoal', ['Pessoal'])
            operacionais = get_dre_col('Despesas Operacionais', ['Operacionais'])
            marketing = get_dre_col('Despesas Marketing', ['Marketing'])
            admin = get_dre_col('Despesas Administrativas', ['Administrativas', 'Administrativo'])
            return pessoal + operacionais + marketing + admin
        else:
            # Tentar calcular outras fórmulas simples
            return pd.Series(0, index=dre.index)
    
    def _buscar_valor_categoria(self, categoria_dre: str, df_preenchido: pd.DataFrame) -> pd.Series:
        """Busca valor de uma categoria nos dados preenchidos, somando categorias mapeadas"""
        if df_preenchido.empty:
            return pd.Series(0, index=df_preenchido.index)
        
        # Se a categoria DRE já existe como coluna, retornar diretamente
        if categoria_dre in df_preenchido.columns:
            return df_preenchido[categoria_dre].fillna(0)
        
        # Buscar todas as categorias originais que mapeiam para esta categoria DRE
        mapeamento = self.mapeamento.get('mapeamento_categorias', {})
        categorias_originais = []
        for cat_orig, info in mapeamento.items():
            if info.get('categoria_dre') == categoria_dre:
                categorias_originais.append(cat_orig)
        
        # Se encontrou categorias mapeadas, somar todas
        if categorias_originais:
            resultado = pd.Series(0.0, index=df_preenchido.index)
            for cat_orig in categorias_originais:
                if cat_orig in df_preenchido.columns:
                    resultado = resultado + df_preenchido[cat_orig].fillna(0)
            return resultado
        
        # Se não encontrou, retornar zeros
        return pd.Series(0.0, index=df_preenchido.index)
    
    def _processar_formula_sum(self, formula: str, df_preenchido: pd.DataFrame) -> pd.Series:
        """Processa fórmula SUM(..., ...) somando categorias"""
        if df_preenchido.empty:
            return pd.Series(0, index=df_preenchido.index)
        
        # Extrair categorias da fórmula SUM(cat1, cat2, ...)
        match = re.search(r'SUM\(([^)]+)\)', formula)
        if not match:
            return pd.Series(0, index=df_preenchido.index)
        
        categorias_str = match.group(1)
        categorias = [c.strip() for c in categorias_str.split(',')]
        
        resultado = pd.Series(0.0, index=df_preenchido.index)
        
        # Para cada categoria, buscar valor
        # As categorias na fórmula SUM são nomes originais, não categorias DRE
        for cat in categorias:
            # Buscar se a categoria original existe como coluna
            if cat in df_preenchido.columns:
                resultado = resultado + df_preenchido[cat].fillna(0)
            else:
                # Tentar buscar via mapeamento
                valor = self._buscar_valor_categoria(cat, df_preenchido)
                resultado = resultado + valor.fillna(0)
        
        return resultado.fillna(0)
    
    def _agrupar_trimestral(self, df: pd.DataFrame) -> pd.DataFrame:
        """Agrupa dados mensais em trimestrais"""
        if df.empty:
            return df
        
        df_trim = df.copy()
        try:
            # Converter índice para período se for string
            if isinstance(df_trim.index[0], str):
                # Formato esperado: '2024-01' ou '2024-01-01'
                df_trim.index = pd.to_datetime(df_trim.index, errors='coerce')
            # Resample trimestral
            df_trim = df_trim.resample('Q', label='left').sum()
            # Formatar índice
            df_trim.index = df_trim.index.to_period('Q').astype(str)
        except Exception as e:
            print(f"Erro ao agrupar trimestral: {e}")
            # Se der erro, retornar original
            return df
        
        return df_trim
    
    def _agrupar_anual(self, df: pd.DataFrame) -> pd.DataFrame:
        """Agrupa dados mensais em anuais"""
        if df.empty:
            return df
        
        df_ano = df.copy()
        try:
            # Converter índice para período se for string
            if isinstance(df_ano.index[0], str):
                # Formato esperado: '2024-01' ou '2024-01-01'
                df_ano.index = pd.to_datetime(df_ano.index, errors='coerce')
            # Resample anual
            df_ano = df_ano.resample('Y', label='left').sum()
            # Formatar índice
            df_ano.index = df_ano.index.strftime('%Y')
        except Exception as e:
            print(f"Erro ao agrupar anual: {e}")
            # Se der erro, retornar original
            return df
        
        return df_ano
    
    def gerar_kpis(self, dre: pd.DataFrame) -> pd.DataFrame:
        """Gera KPIs a partir do DRE"""
        kpis_config = self.mapeamento.get('kpis', {})
        kpis = pd.DataFrame(index=dre.index)
        
        for kpi_nome, kpi_config in kpis_config.items():
            formula = kpi_config.get('formula', '')
            tipo = kpi_config.get('tipo', 'percentual')
            
            # Calcular KPI
            valor = self._calcular_kpi(formula, dre)
            kpis[kpi_nome] = valor
        
        return kpis
    
    def _calcular_kpi(self, formula: str, dre: pd.DataFrame) -> pd.Series:
        """Calcula KPI baseado em fórmula"""
        formula_lower = formula.lower()
        
        # Função auxiliar para buscar coluna com fallback
        def get_col(col_name, alt_names=None):
            if col_name in dre.columns:
                return dre[col_name].fillna(0)
            if alt_names:
                for alt in alt_names:
                    if alt in dre.columns:
                        return dre[alt].fillna(0)
            return pd.Series(0, index=dre.index)
        
        if 'margem bruta' in formula_lower or '(lucro bruto / receita líquida)' in formula_lower or 'lucro bruto' in formula_lower:
            receita_liq = get_col('Receita Líquida', ['Receita Liquida'])
            lucro_bruto = get_col('Lucro Bruto')
            
            # Evitar divisão por zero
            result = pd.Series(0.0, index=dre.index)
            mask = receita_liq != 0
            result[mask] = (lucro_bruto[mask] / receita_liq[mask]) * 100
            return result.fillna(0)
        
        elif 'margem ebitda' in formula_lower or '(ebitda / receita líquida)' in formula_lower:
            receita_liq = get_col('Receita Líquida', ['Receita Liquida'])
            ebitda = get_col('EBITDA')
            
            # Evitar divisão por zero
            result = pd.Series(0.0, index=dre.index)
            mask = receita_liq != 0
            result[mask] = (ebitda[mask] / receita_liq[mask]) * 100
            return result.fillna(0)
        
        elif 'margem líquida' in formula_lower or '(resultado líquido / receita líquida)' in formula_lower or 'resultado líquido' in formula_lower:
            receita_liq = get_col('Receita Líquida', ['Receita Liquida'])
            resultado_liq = get_col('Resultado Líquido', ['Resultado Liquido'])
            
            # Evitar divisão por zero
            result = pd.Series(0.0, index=dre.index)
            mask = receita_liq != 0
            result[mask] = (resultado_liq[mask] / receita_liq[mask]) * 100
            return result.fillna(0)
        
        else:
            return pd.Series(0.0, index=dre.index)
    
    def gerar_flags_coverage(self, coverage: Dict[str, float]) -> pd.DataFrame:
        """Gera DataFrame com flags de coverage"""
        flags = pd.DataFrame.from_dict(coverage, orient='index', columns=['coverage_pct'])
        
        flags['status'] = flags['coverage_pct'].apply(
            lambda v: 'OK' if v >= self.coverage_threshold_full 
            else ('PARCIAL' if v >= self.coverage_threshold_partial 
                  else 'FALLBACK_HIST')
        )
        
        flags['cor'] = flags['status'].apply(
            lambda s: 'verde' if s == 'OK' 
            else ('amarelo' if s == 'PARCIAL' else 'vermelho')
        )
        
        return flags

