"""
Script para processar dados via API
Recebe caminhos de arquivos e retorna JSON
"""

import sys
import json
import os
import numpy as np
import pandas as pd
from pathlib import Path

# Adicionar src/core ao path
core_dir = Path(__file__).parent.parent / "src" / "core"
sys.path.insert(0, str(core_dir))

from sistema_analise_financeira import SistemaAnaliseFinanceira

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Caminho do arquivo não fornecido"}))
        sys.exit(1)
    
    file_path = sys.argv[1] if sys.argv[1] != "None" else None
    historical_path = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] != "None" else None
    file_type = sys.argv[3] if len(sys.argv) > 3 else 'excel'
    manual_data_path = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != "None" else None
    
    try:
        # Carregar dados do Excel se fornecido
        df_excel = None
        sistema = None
        if file_path and file_path.endswith('.xlsx'):
            sistema = SistemaAnaliseFinanceira(file_path, historical_path)
            sistema.carregar_dados()
            df_excel = sistema.dados_atuais.copy() if sistema.dados_atuais is not None and not sistema.dados_atuais.empty else None
        
        # Carregar dados manuais se fornecido
        df_manual = None
        info_basica = None
        if manual_data_path:
            try:
                df_manual = pd.read_csv(manual_data_path, parse_dates=['data'], on_bad_lines='skip')
                
                # Extrair info_basica se presente
                if 'info_basica' in df_manual.columns:
                    # Pegar primeira linha com info_basica não vazio
                    info_basica_rows = df_manual[df_manual['info_basica'].notna() & (df_manual['info_basica'] != '')]
                    if len(info_basica_rows) > 0:
                        try:
                            info_basica_str = str(info_basica_rows.iloc[0]['info_basica'])
                            if info_basica_str and info_basica_str != 'nan' and info_basica_str.strip():
                                info_basica = json.loads(info_basica_str)
                        except Exception as e:
                            pass
                    # Remover coluna info_basica do DataFrame
                    df_manual = df_manual.drop(columns=['info_basica'], errors='ignore')
                
                # Filtrar linhas vazias (valor <= 0 ou NaN)
                if 'valor' in df_manual.columns:
                    df_manual = df_manual[df_manual['valor'].notna() & (df_manual['valor'] > 0)]
                
                if df_manual.empty:
                    df_manual = None
            except Exception as e:
                print(f"Erro ao carregar dados manuais: {e}", file=sys.stderr)
                df_manual = None
        
        # Mesclar dados se ambos existirem
        if df_excel is not None and df_manual is not None:
            # Combinar DataFrames - garantir mesmas colunas
            # Normalizar colunas para mesclagem
            colunas_base = ['data', 'categoria', 'valor', 'tipo', 'fonte']
            
            # Adicionar 'descricao' se não existir
            if 'descricao' not in df_excel.columns:
                df_excel['descricao'] = df_excel.get('tipo_servico', df_excel.get('subcategoria', ''))
            if 'descricao' not in df_manual.columns:
                df_manual['descricao'] = df_manual.get('tipo_servico', df_manual.get('subcategoria', ''))
            
            # Selecionar colunas comuns
            colunas_merge = colunas_base + ['descricao']
            df_excel_clean = df_excel[[c for c in colunas_merge if c in df_excel.columns]].copy()
            df_manual_clean = df_manual[[c for c in colunas_merge if c in df_manual.columns]].copy()
            
            # Combinar DataFrames
            df_merged = pd.concat([df_excel_clean, df_manual_clean], ignore_index=True)
            df_merged = df_merged.sort_values('data').reset_index(drop=True)
            
            # Criar sistema sem caminho de planilha
            sistema = SistemaAnaliseFinanceira(None, historical_path)
            sistema.dados_atuais = df_merged
            # Carregar histórico se fornecido
            if historical_path:
                try:
                    sistema.dados_historicos = pd.read_csv(historical_path, parse_dates=['data'])
                except:
                    sistema.dados_historicos = None
            else:
                sistema.dados_historicos = None
            print(f"Dados mesclados: {len(df_excel)} do Excel + {len(df_manual)} manuais = {len(df_merged)} total")
        elif df_manual is not None:
            # Apenas dados manuais - tentar buscar da planilha base se houver info_basica
            planilha_base_path = None
            
            # Verificar se há planilha base definida (usar caminho padrão)
            caminho_base = os.path.join(os.path.dirname(__file__), '..', 'data', 'resultados', 
                                       'MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx')
            if os.path.exists(caminho_base):
                planilha_base_path = caminho_base
            
            sistema = SistemaAnaliseFinanceira(planilha_base_path if planilha_base_path else None, historical_path)
            
            # Se tem planilha base, mesclar dados
            if planilha_base_path and os.path.exists(planilha_base_path):
                try:
                    # Carregar dados da planilha base
                    sistema.carregar_dados()
                    df_base = sistema.dados_atuais if sistema.dados_atuais is not None else pd.DataFrame()
                    
                    # Mesclar com dados manuais
                    if len(df_base) > 0 and len(df_manual) > 0:
                        # Garantir mesmas colunas
                        colunas_base = ['data', 'categoria', 'valor', 'tipo', 'fonte', 'descricao']
                        for col in colunas_base:
                            if col not in df_base.columns:
                                df_base[col] = ''
                            if col not in df_manual.columns:
                                df_manual[col] = ''
                        
                        df_merged = pd.concat([df_base, df_manual], ignore_index=True)
                        sistema.dados_atuais = df_merged
                        print(f"Mesclando dados: {len(df_base)} da planilha base + {len(df_manual)} manuais = {len(df_merged)} total")
                    elif len(df_base) > 0:
                        sistema.dados_atuais = df_base
                        print(f"Usando dados da planilha base: {len(df_base)} registros")
                    else:
                        sistema.dados_atuais = df_manual
                        print(f"Usando apenas dados manuais: {len(df_manual)} registros")
                except Exception as e:
                    print(f"Erro ao mesclar com planilha base: {e}", file=sys.stderr)
                    sistema.dados_atuais = df_manual
                    print(f"Usando apenas dados manuais: {len(df_manual)} registros")
            else:
                sistema.dados_atuais = df_manual
                print(f"Usando apenas dados manuais: {len(df_manual)} registros")
            
            # Carregar histórico se fornecido
            if historical_path:
                try:
                    sistema.dados_historicos = pd.read_csv(historical_path, parse_dates=['data'])
                except:
                    sistema.dados_historicos = None
            else:
                sistema.dados_historicos = None
        elif df_excel is not None:
            # Apenas dados do Excel (já carregado acima, sistema já criado)
            print(f"Usando apenas dados do Excel: {len(df_excel)} registros")
        else:
            print(json.dumps({"error": "Nenhum dado fornecido"}))
            sys.exit(1)
        
        sistema.processar_dados()
        sistema.gerar_dres()
        
        # Função para normalizar nome de coluna (converter para snake_case)
        def normalize_column_name(name):
            if not name or name == 'periodo' or name == 'year_month':
                return name
            # Converter para lowercase e substituir espaços por underscore
            normalized = str(name).lower().strip()
            # Substituir espaços e caracteres especiais por underscore
            normalized = normalized.replace(' ', '_').replace('(', '').replace(')', '').replace('&', 'e')
            normalized = normalized.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
            normalized = normalized.replace('ã', 'a').replace('õ', 'o').replace('ç', 'c')
            # Remover underscores duplicados
            while '__' in normalized:
                normalized = normalized.replace('__', '_')
            # Remover underscore no final
            normalized = normalized.rstrip('_')
            return normalized
        
        # Converter para dict com limpeza de NaN
        def df_to_dict(df):
            if df is None or df.empty:
                return []
            df_copy = df.copy()
            
            # Normalizar nomes das colunas ANTES de reset_index
            df_copy.columns = [normalize_column_name(col) for col in df_copy.columns]
            
            # Definir nome do índice e resetar
            if df_copy.index.name is None or df_copy.index.name == '':
                df_copy.index.name = 'periodo'
            df_copy = df_copy.reset_index()
            
            # Normalizar também o nome da coluna do índice se necessário
            if 'year_month' in df_copy.columns:
                df_copy = df_copy.rename(columns={'year_month': 'periodo'})
            
            # Função para limpar valores
            def clean_value(v):
                if pd.isna(v):
                    return 0.0  # Retornar 0 ao invés de None para evitar problemas
                if isinstance(v, (np.integer, np.floating)):
                    if np.isnan(v) or np.isinf(v):
                        return 0.0
                    return float(v) if isinstance(v, np.floating) else int(v)
                if isinstance(v, float):
                    if v != v or v == float('inf') or v == float('-inf'):  # NaN ou inf
                        return 0.0
                return v
            
            # Converter para records e limpar
            records = []
            for _, row in df_copy.iterrows():
                record = {}
                for col in df_copy.columns:
                    record[col] = clean_value(row[col])
                records.append(record)
            
            return records
        
        resultado = {
            'dre_mensal': df_to_dict(sistema.dre_mensal),
            'dre_trimestral': df_to_dict(sistema.dre_trimestral),
            'dre_anual': df_to_dict(sistema.dre_anual),
            'kpis': df_to_dict(sistema.kpis),
            'flags': sistema.flags.reset_index().to_dict('records') if sistema.flags is not None and not sistema.flags.empty else [],
            'sources': [],
            'total_records': len(sistema.dados_atuais) if sistema.dados_atuais is not None else 0,
            'total_months': len(sistema.dados_mensais.index) if sistema.dados_mensais is not None else 0,
        }
        
        # Função para limpar NaN e inf do resultado
        def clean_for_json(obj):
            if isinstance(obj, dict):
                return {k: clean_for_json(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [clean_for_json(item) for item in obj]
            elif isinstance(obj, (float, np.floating)):
                # Verificar NaN ou infinito
                if np.isnan(obj) or np.isinf(obj):
                    return None
                return float(obj)
            elif isinstance(obj, (int, np.integer)):
                return int(obj)
            elif isinstance(obj, (str, bool)) or obj is None:
                return obj
            else:
                # Converter outros tipos para string
                try:
                    return str(obj)
                except:
                    return None
        
        # Limpar resultado
        resultado_limpo = clean_for_json(resultado)
        
        # Salvar em arquivo temporário (fallback)
        temp_dir = Path(__file__).parent.parent / "tmp"
        temp_dir.mkdir(exist_ok=True)
        result_path = temp_dir / "resultado.json"
        
        with open(result_path, 'w', encoding='utf-8') as f:
            json.dump(resultado_limpo, f, default=str, ensure_ascii=False)
        
        # Também imprimir para stdout
        print(json.dumps(resultado_limpo, default=str, ensure_ascii=False))
        
    except Exception as e:
        import traceback
        error_data = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_data))
        sys.exit(1)

if __name__ == "__main__":
    main()

