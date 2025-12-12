"""
Módulo de extração de dados da planilha Excel
Extrai dados de Receitas, Despesas, DRE e outras abas relevantes
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import warnings
warnings.filterwarnings('ignore')


class ExtratorPlanilha:
    """Classe para extrair e normalizar dados da planilha de modelagem financeira"""
    
    def __init__(self, caminho_planilha: str):
        self.caminho_planilha = caminho_planilha
        self.xls = pd.ExcelFile(caminho_planilha)
        self.dados_receitas = None
        self.dados_despesas = None
        self.dados_dre = None
        
    def extrair_receitas(self) -> pd.DataFrame:
        """
        Extrai dados de receitas das abas Receitas_1, Receitas_2, Receitas_3
        Retorna DataFrame normalizado com: data, categoria, valor, tipo_servico
        """
        receitas_list = []
        
        for aba in ['Receitas_1', 'Receitas_2', 'Receitas_3']:
            if aba not in self.xls.sheet_names:
                continue
                
            try:
                df = pd.read_excel(self.xls, sheet_name=aba, header=None)
                
                # Procurar linha de cabeçalho (linha com meses)
                header_row = None
                for i in range(min(5, len(df))):
                    row_vals = df.iloc[i].astype(str).str.lower().tolist()
                    if any('jan' in str(v) or 'fev' in str(v) or 'mar' in str(v) for v in row_vals):
                        header_row = i
                        break
                
                if header_row is None:
                    continue
                
                # Extrair meses/anos do cabeçalho
                meses_anos = []
                for col_idx in range(df.shape[1]):
                    val = str(df.iloc[header_row, col_idx]).lower()
                    if 'jan' in val or 'fev' in val or 'mar' in val or 'abr' in val or \
                       'mai' in val or 'jun' in val or 'jul' in val or 'ago' in val or \
                       'set' in val or 'out' in val or 'nov' in val or 'dez' in val:
                        # Tentar identificar ano
                        ano_row = header_row - 1 if header_row > 0 else None
                        ano = None
                        if ano_row is not None:
                            ano_val = str(df.iloc[ano_row, col_idx]).lower()
                            if 'ano' in ano_val:
                                ano = int(ano_val.replace('ano', '').strip()) if ano_val.replace('ano', '').strip().isdigit() else 1
                        
                        meses_anos.append({
                            'col_idx': col_idx,
                            'mes': val[:3].capitalize(),
                            'ano': ano or 1
                        })
                
                # Extrair serviços (linhas com nomes de serviços)
                for row_idx in range(header_row + 2, min(header_row + 50, len(df))):
                    servico = str(df.iloc[row_idx, 0]).strip()
                    if pd.isna(df.iloc[row_idx, 0]) or servico == 'nan' or len(servico) < 5:
                        continue
                    
                    # Extrair valores por mês
                    for mes_info in meses_anos:
                        try:
                            valor = df.iloc[row_idx, mes_info['col_idx']]
                            if pd.notna(valor) and isinstance(valor, (int, float)) and valor != 0:
                                # Converter para data
                                mes_num = {'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4,
                                          'Mai': 5, 'Jun': 6, 'Jul': 7, 'Ago': 8,
                                          'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12}
                                ano_base = 2020 + mes_info['ano'] - 1  # Ajustar conforme necessário
                                
                                receitas_list.append({
                                    'data': pd.Timestamp(year=ano_base, month=mes_num.get(mes_info['mes'], 1), day=1),
                                    'categoria': 'Receita',
                                    'tipo_servico': servico,
                                    'valor': float(valor),
                                    'tipo': 'entrada',
                                    'fonte': aba
                                })
                        except:
                            continue
                            
            except Exception as e:
                print(f"Erro ao processar aba {aba}: {e}")
                continue
        
        if receitas_list:
            self.dados_receitas = pd.DataFrame(receitas_list)
            return self.dados_receitas
        else:
            return pd.DataFrame(columns=['data', 'categoria', 'tipo_servico', 'valor', 'tipo', 'fonte'])
    
    def extrair_despesas(self) -> pd.DataFrame:
        """
        Extrai dados de despesas da aba 'Despesas Mensais'
        Retorna DataFrame normalizado
        """
        despesas_list = []
        
        if 'Despesas Mensais' not in self.xls.sheet_names:
            return pd.DataFrame(columns=['data', 'categoria', 'subcategoria', 'valor', 'tipo'])
        
        try:
            df = pd.read_excel(self.xls, sheet_name='Despesas Mensais', header=None)
            
            # Procurar linha de cabeçalho
            header_row = None
            for i in range(min(5, len(df))):
                row_vals = df.iloc[i].astype(str).str.lower().tolist()
                if any('ano 1' in str(v).lower() or 'ano 2' in str(v).lower() for v in row_vals):
                    header_row = i
                    break
            
            if header_row is None:
                return pd.DataFrame(columns=['data', 'categoria', 'subcategoria', 'valor', 'tipo'])
            
            # Extrair anos das colunas
            anos_cols = {}
            for col_idx in range(2, min(8, df.shape[1])):
                ano_val = str(df.iloc[header_row, col_idx]).lower()
                if 'ano' in ano_val:
                    ano_num = int(ano_val.replace('ano', '').strip()) if ano_val.replace('ano', '').strip().isdigit() else 1
                    anos_cols[col_idx] = ano_num
            
            # Extrair despesas (assumindo valores mensais constantes por ano)
            for row_idx in range(header_row + 2, min(header_row + 40, len(df))):
                descricao = str(df.iloc[row_idx, 1]).strip()
                if pd.isna(df.iloc[row_idx, 1]) or descricao == 'nan' or len(descricao) < 3:
                    continue
                
                # Categorizar despesa
                categoria = self._categorizar_despesa(descricao)
                
                # Extrair valores por ano (assumindo valor mensal)
                for col_idx, ano_num in anos_cols.items():
                    try:
                        valor_mensal = df.iloc[row_idx, col_idx]
                        if pd.notna(valor_mensal) and isinstance(valor_mensal, (int, float)) and valor_mensal != 0:
                            # Criar entrada para cada mês do ano
                            ano_base = 2020 + ano_num - 1
                            for mes in range(1, 13):
                                despesas_list.append({
                                    'data': pd.Timestamp(year=ano_base, month=mes, day=1),
                                    'categoria': categoria,
                                    'subcategoria': descricao,
                                    'valor': float(valor_mensal),
                                    'tipo': 'saida',
                                    'fonte': 'Despesas Mensais'
                                })
                    except:
                        continue
                        
        except Exception as e:
            print(f"Erro ao processar despesas: {e}")
        
        if despesas_list:
            self.dados_despesas = pd.DataFrame(despesas_list)
            return self.dados_despesas
        else:
            return pd.DataFrame(columns=['data', 'categoria', 'subcategoria', 'valor', 'tipo', 'fonte'])
    
    def _categorizar_despesa(self, descricao: str) -> str:
        """Categoriza despesa baseado na descrição"""
        desc_lower = descricao.lower()
        
        if any(x in desc_lower for x in ['salário', 'salario', 'encargo', 'folha', 'pró-labore', 'pro-labore']):
            return 'Pessoal'
        elif any(x in desc_lower for x in ['aluguel', 'iptu', 'condomínio', 'condominio']):
            return 'Aluguel'
        elif any(x in desc_lower for x in ['água', 'agua', 'energia', 'elétrica', 'eletrica', 'gás', 'gas', 'utilidade']):
            return 'Utilidades'
        elif any(x in desc_lower for x in ['telefone', 'internet', 'celular']):
            return 'Telecomunicações'
        elif any(x in desc_lower for x in ['marketing', 'publicidade', 'propaganda', 'mkt']):
            return 'Marketing'
        elif any(x in desc_lower for x in ['contador', 'auditoria', 'bancária', 'bancaria']):
            return 'Administrativo'
        elif any(x in desc_lower for x in ['manutenção', 'manutencao', 'seguro']):
            return 'Manutenção'
        elif any(x in desc_lower for x in ['material', 'insumo', 'limpeza']):
            return 'Insumos'
        else:
            return 'Outras Despesas'
    
    def extrair_dre_existente(self) -> Optional[pd.DataFrame]:
        """Extrai DRE já calculado da aba 'DRE' se existir"""
        if 'DRE' not in self.xls.sheet_names:
            return None
        
        try:
            df = pd.read_excel(self.xls, sheet_name='DRE', header=None)
            # Implementar lógica de extração do DRE existente se necessário
            return df
        except:
            return None
    
    def extrair_receitas_fluxo_caixa(self) -> pd.DataFrame:
        """
        Extrai receitas da aba 'Fluxo de Caixa' (mais confiável)
        """
        receitas_list = []
        
        if 'Fluxo de Caixa' not in self.xls.sheet_names:
            return pd.DataFrame(columns=['data', 'categoria', 'tipo_servico', 'valor', 'tipo', 'fonte'])
        
        try:
            df = pd.read_excel(self.xls, sheet_name='Fluxo de Caixa', header=None)
            
            # Procurar cabeçalho com meses (linha 2 tem "mês 1", "mês 2", etc)
            header_row = None
            for i in range(10):
                row_vals = df.iloc[i].astype(str).str.lower().tolist()
                if any('mês' in str(v) or 'mes' in str(v) for v in row_vals):
                    header_row = i
                    break
            
            if header_row is None:
                return pd.DataFrame(columns=['data', 'categoria', 'tipo_servico', 'valor', 'tipo', 'fonte'])
            
            # Procurar linha "Entrada Líquida" 
            # Texto está na coluna 1, valores na mesma linha, colunas 8+
            entrada_row = None
            for i in range(header_row + 1, min(header_row + 20, len(df))):
                # Verificar coluna 0, 1 e 2 para o texto
                row_texts = []
                for col_idx in range(min(3, df.shape[1])):
                    val = df.iloc[i, col_idx]
                    if pd.notna(val):
                        row_texts.append(str(val).lower())
                row_text = ' '.join(row_texts)
                
                # Procurar por variações do texto
                if any(x in row_text for x in ['entrada líquida', 'entrada liquida', '(=) entrada', 'entrada']):
                    # Verificar se esta linha tem valores nas colunas 8+
                    tem_valores = False
                    for col in range(8, min(30, df.shape[1])):
                        val = df.iloc[i, col]
                        if pd.notna(val) and isinstance(val, (int, float)) and val != 0:
                            tem_valores = True
                            break
                    if tem_valores:
                        entrada_row = i
                        break
            
            if entrada_row is None:
                return pd.DataFrame(columns=['data', 'categoria', 'tipo_servico', 'valor', 'tipo', 'fonte'])
            
            # Extrair valores da linha de entrada líquida
            ano_base = 2020
            mes_atual = 1
            
            # Linha acima do header tem os anos
            ano_row = header_row - 1 if header_row > 0 else None
            
            for col_idx in range(8, min(df.shape[1], 100)):  # Começar da coluna 8
                    # Verificar se é coluna de mês
                    header_val = str(df.iloc[header_row, col_idx]).lower()
                    if 'mês' in header_val or 'mes' in header_val:
                        # Extrair número do mês
                        try:
                            mes_num = int(''.join(filter(str.isdigit, header_val)))
                            # Garantir que está entre 1 e 12
                            if mes_num < 1 or mes_num > 12:
                                mes_num = mes_atual
                        except:
                            mes_num = mes_atual
                    
                    # Verificar ano na linha acima
                    if ano_row is not None:
                        ano_val = str(df.iloc[ano_row, col_idx]).lower()
                        if 'ano' in ano_val:
                            try:
                                ano_num = int(''.join(filter(str.isdigit, ano_val)))
                                ano_base = 2020 + ano_num - 1
                            except:
                                pass
                    
                    # Extrair valor da linha de entrada líquida
                    valor = df.iloc[entrada_row, col_idx]
                    if pd.notna(valor) and isinstance(valor, (int, float)) and valor != 0:
                        receitas_list.append({
                            'data': pd.Timestamp(year=ano_base, month=mes_num, day=1),
                            'categoria': 'Receita',
                            'tipo_servico': 'Entrada Líquida',
                            'valor': float(valor),
                            'tipo': 'entrada',
                            'fonte': 'Fluxo de Caixa'
                        })
                    
                    mes_atual = mes_num
                    if mes_atual >= 12:
                        mes_atual = 1
                        ano_base += 1
                        
        except Exception as e:
            print(f"Erro ao extrair receitas do Fluxo de Caixa: {e}")
        
        if receitas_list:
            return pd.DataFrame(receitas_list)
        else:
            return pd.DataFrame(columns=['data', 'categoria', 'tipo_servico', 'valor', 'tipo', 'fonte'])
    
    def consolidar_dados(self) -> pd.DataFrame:
        """Consolida receitas e despesas em um único DataFrame"""
        receitas = self.extrair_receitas()
        # Se não encontrou receitas, tentar do Fluxo de Caixa
        if receitas.empty:
            receitas = self.extrair_receitas_fluxo_caixa()
            if not receitas.empty:
                print(f"Receitas extraidas do Fluxo de Caixa: {len(receitas)} registros")
        despesas = self.extrair_despesas()
        
        # Normalizar colunas
        if not receitas.empty:
            receitas['subcategoria'] = receitas.get('tipo_servico', '')
        
        if not despesas.empty:
            despesas['tipo_servico'] = despesas.get('subcategoria', '')
        
        # Combinar
        colunas_comuns = ['data', 'categoria', 'valor', 'tipo', 'fonte']
        if not receitas.empty and not despesas.empty:
            df_consolidado = pd.concat([
                receitas[colunas_comuns + ['tipo_servico']].rename(columns={'tipo_servico': 'descricao'}),
                despesas[colunas_comuns + ['subcategoria']].rename(columns={'subcategoria': 'descricao'})
            ], ignore_index=True)
        elif not receitas.empty:
            df_consolidado = receitas[colunas_comuns + ['tipo_servico']].rename(columns={'tipo_servico': 'descricao'})
        elif not despesas.empty:
            df_consolidado = despesas[colunas_comuns + ['subcategoria']].rename(columns={'subcategoria': 'descricao'})
        else:
            df_consolidado = pd.DataFrame(columns=colunas_comuns + ['descricao'])
        
        return df_consolidado.sort_values('data').reset_index(drop=True)


if __name__ == "__main__":
    # Teste
    extrator = ExtratorPlanilha('MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx')
    dados = extrator.consolidar_dados()
    print(f"\nDados consolidados: {len(dados)} registros")
    print(dados.head(20))

