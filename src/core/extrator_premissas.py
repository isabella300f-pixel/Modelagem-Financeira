"""
Extrator de Premissas da Planilha Base
Extrai informações como tipo de negócio, localização, capital investido, etc.
"""

import pandas as pd
from pathlib import Path
from typing import Dict, Optional, Any


class ExtratorPremissas:
    """Extrai premissas e informações da planilha base"""
    
    def __init__(self, caminho_planilha: Optional[str] = None):
        self.caminho_planilha = caminho_planilha
        self.xls = None
        if caminho_planilha and Path(caminho_planilha).exists():
            try:
                self.xls = pd.ExcelFile(caminho_planilha)
            except:
                pass
    
    def extrair_premissas(self) -> Dict[str, Any]:
        """Extrai todas as premissas da planilha"""
        premissas = {}
        
        if not self.xls:
            return premissas
        
        try:
            # Buscar em diferentes abas
            # Tentar encontrar tipo de negócio, estado, cidade, etc.
            
            # Buscar em "Premissas" ou "Dashboard"
            for sheet_name in self.xls.sheet_names:
                try:
                    df = pd.read_excel(self.xls, sheet_name=sheet_name, header=None)
                    
                    # Buscar padrões específicos
                    for i in range(min(50, len(df))):
                        for j in range(min(10, df.shape[1])):
                            val = str(df.iloc[i, j]).strip().lower() if pd.notna(df.iloc[i, j]) else ''
                            
                            # Tipo de negócio / Segmento
                            if any(x in val for x in ['tipo', 'segmento', 'negócio', 'negocio']) and j < df.shape[1] - 1:
                                next_val = str(df.iloc[i, j+1]).strip() if pd.notna(df.iloc[i, j+1]) else ''
                                if next_val and next_val != 'nan' and len(next_val) < 50:
                                    if 'tipo_negocio' not in premissas:
                                        premissas['tipo_negocio'] = next_val.title()
                            
                            # Estado
                            if any(x in val for x in ['estado', 'uf', 'state']) and j < df.shape[1] - 1:
                                next_val = str(df.iloc[i, j+1]).strip() if pd.notna(df.iloc[i, j+1]) else ''
                                if next_val and next_val != 'nan':
                                    if 'estado' not in premissas:
                                        premissas['estado'] = next_val.title()
                            
                            # Cidade
                            if any(x in val for x in ['cidade', 'city', 'município', 'municipio']) and j < df.shape[1] - 1:
                                next_val = str(df.iloc[i, j+1]).strip() if pd.notna(df.iloc[i, j+1]) else ''
                                if next_val and next_val != 'nan':
                                    if 'cidade' not in premissas:
                                        premissas['cidade'] = next_val.title()
                            
                            # Capital Investido
                            if any(x in val for x in ['capital', 'investimento', 'investido']) and j < df.shape[1] - 1:
                                next_val = df.iloc[i, j+1]
                                if pd.notna(next_val):
                                    try:
                                        capital = float(next_val)
                                        if capital > 0:
                                            if 'capital_investido' not in premissas:
                                                premissas['capital_investido'] = capital
                                    except:
                                        pass
                            
                            # Ticket Médio
                            if any(x in val for x in ['ticket', 'médio', 'medio', 'preço', 'preco']) and j < df.shape[1] - 1:
                                next_val = df.iloc[i, j+1]
                                if pd.notna(next_val):
                                    try:
                                        ticket = float(next_val)
                                        if ticket > 0:
                                            if 'ticket_medio' not in premissas:
                                                premissas['ticket_medio'] = ticket
                                    except:
                                        pass
                            
                            # Capacidade
                            if any(x in val for x in ['capacidade', 'clientes', 'atendimentos']) and j < df.shape[1] - 1:
                                next_val = df.iloc[i, j+1]
                                if pd.notna(next_val):
                                    try:
                                        capacidade = float(next_val)
                                        if capacidade > 0:
                                            if 'capacidade' not in premissas:
                                                premissas['capacidade'] = capacidade
                                    except:
                                        pass
                    
                    # Buscar no título/nome do arquivo
                    if 'lages' in sheet_name.lower():
                        premissas['cidade'] = 'Lages'
                    if 'sc' in sheet_name.lower() or 'santa catarina' in sheet_name.lower():
                        premissas['estado'] = 'Santa Catarina'
                
                except Exception as e:
                    continue
            
            # Buscar no nome do arquivo também
            if self.caminho_planilha:
                filename = Path(self.caminho_planilha).stem.lower()
                if 'lages' in filename:
                    premissas['cidade'] = 'Lages'
                if 'sc' in filename:
                    premissas['estado'] = 'Santa Catarina (SC)'
                if 'home office' in filename:
                    premissas['tipo_negocio'] = 'Home Office'
        
        except Exception as e:
            print(f"Erro ao extrair premissas: {e}")
        
        return premissas
    
    def buscar_valor_default(self, campo: str, valor_usuario: Optional[Any] = None) -> Any:
        """Busca valor padrão da planilha se usuário não forneceu"""
        if valor_usuario is not None and valor_usuario != '' and valor_usuario != 0:
            return valor_usuario
        
        premissas = self.extrair_premissas()
        mapeamento = {
            'tipo_negocio': 'tipo_negocio',
            'estado': 'estado',
            'cidade': 'cidade',
            'capital_investido': 'capital_investido',
            'ticket_medio': 'ticket_medio',
            'capacidade': 'capacidade',
            'nome_cliente': 'nome_cliente',
            'nome_estabelecimento': 'nome_estabelecimento',
        }
        
        campo_planilha = mapeamento.get(campo, campo)
        return premissas.get(campo_planilha, None)

