"""
Dashboard Streamlit para visualização interativa dos resultados
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
import sys

# Adicionar módulos ao path
sys.path.append(str(Path(__file__).parent))

from sistema_analise_financeira import SistemaAnaliseFinanceira


st.set_page_config(
    page_title="Análise Financeira - DRE",
    page_icon="📊",
    layout="wide"
)

st.title("📊 Sistema de Análise Financeira - DRE")
st.markdown("---")

# Sidebar - Upload e configurações
st.sidebar.header("Configurações")

# Upload de planilha
arquivo_planilha = st.sidebar.file_uploader(
    "Upload da Planilha Excel",
    type=['xlsx', 'xls'],
    help="Faça upload da planilha de modelagem financeira"
)

# Upload de histórico (opcional)
arquivo_historico = st.sidebar.file_uploader(
    "Upload de Base Histórica (CSV - Opcional)",
    type=['csv'],
    help="Base histórica para fallback quando dados atuais forem insuficientes"
)

# Botão de processamento
processar = st.sidebar.button("🔄 Processar Dados", type="primary")

# Inicializar sessão
if 'sistema' not in st.session_state:
    st.session_state.sistema = None
if 'processado' not in st.session_state:
    st.session_state.processado = False

# Processar dados
if processar and arquivo_planilha:
    with st.spinner("Processando dados... Isso pode levar alguns segundos."):
        try:
            # Salvar arquivo temporariamente
            caminho_temp = f"temp_{arquivo_planilha.name}"
            with open(caminho_temp, "wb") as f:
                f.write(arquivo_planilha.getbuffer())
            
            caminho_historico = None
            if arquivo_historico:
                caminho_historico_temp = f"temp_{arquivo_historico.name}"
                with open(caminho_historico_temp, "wb") as f:
                    f.write(arquivo_historico.getbuffer())
                caminho_historico = caminho_historico_temp
            
            # Criar e executar sistema
            sistema = SistemaAnaliseFinanceira(caminho_temp, caminho_historico)
            sistema.carregar_dados()
            sistema.processar_dados()
            sistema.gerar_dres()
            
            st.session_state.sistema = sistema
            st.session_state.processado = True
            
            st.sidebar.success("✅ Dados processados com sucesso!")
            
        except Exception as e:
            st.sidebar.error(f"❌ Erro: {str(e)}")
            st.session_state.processado = False

# Se já processado, mostrar resultados
if st.session_state.processado and st.session_state.sistema:
    sistema = st.session_state.sistema
    
    # Tabs
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📈 Dashboard", 
        "💰 DRE", 
        "🎯 KPIs", 
        "🚦 Flags & Coverage", 
        "📥 Exportar"
    ])
    
    with tab1:
        st.header("Dashboard Executivo")
        
        # Métricas principais
        if sistema.dre_mensal is not None and not sistema.dre_mensal.empty:
            ultimo_mes = sistema.dre_mensal.index[-1]
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                receita = sistema.dre_mensal.loc[ultimo_mes, 'Receita Líquida'] if 'Receita Líquida' in sistema.dre_mensal.columns else 0
                st.metric("Receita Líquida", f"R$ {receita:,.2f}")
            
            with col2:
                ebitda = sistema.dre_mensal.loc[ultimo_mes, 'EBITDA'] if 'EBITDA' in sistema.dre_mensal.columns else 0
                st.metric("EBITDA", f"R$ {ebitda:,.2f}")
            
            with col3:
                resultado = sistema.dre_mensal.loc[ultimo_mes, 'Resultado Líquido'] if 'Resultado Líquido' in sistema.dre_mensal.columns else 0
                st.metric("Resultado Líquido", f"R$ {resultado:,.2f}")
            
            with col4:
                if sistema.kpis is not None and not sistema.kpis.empty:
                    margem = sistema.kpis.loc[ultimo_mes, 'Margem Líquida'] if 'Margem Líquida' in sistema.kpis.columns else 0
                    st.metric("Margem Líquida", f"{margem:.2f}%")
        
        # Gráficos
        st.subheader("Evolução Temporal")
        
        if sistema.dre_mensal is not None and not sistema.dre_mensal.empty:
            fig = go.Figure()
            
            if 'Receita Líquida' in sistema.dre_mensal.columns:
                fig.add_trace(go.Scatter(
                    x=sistema.dre_mensal.index,
                    y=sistema.dre_mensal['Receita Líquida'],
                    name='Receita Líquida',
                    line=dict(color='blue', width=2)
                ))
            
            if 'EBITDA' in sistema.dre_mensal.columns:
                fig.add_trace(go.Scatter(
                    x=sistema.dre_mensal.index,
                    y=sistema.dre_mensal['EBITDA'],
                    name='EBITDA',
                    line=dict(color='green', width=2)
                ))
            
            if 'Resultado Líquido' in sistema.dre_mensal.columns:
                fig.add_trace(go.Scatter(
                    x=sistema.dre_mensal.index,
                    y=sistema.dre_mensal['Resultado Líquido'],
                    name='Resultado Líquido',
                    line=dict(color='orange', width=2)
                ))
            
            fig.update_layout(
                title="Evolução Financeira Mensal",
                xaxis_title="Período",
                yaxis_title="Valor (R$)",
                hovermode='x unified',
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
    
    with tab2:
        st.header("Demonstração do Resultado do Exercício (DRE)")
        
        periodo = st.selectbox("Período", ["Mensal", "Trimestral", "Anual"], index=0)
        
        if periodo == "Mensal" and sistema.dre_mensal is not None:
            st.dataframe(sistema.dre_mensal.style.format("{:,.2f}"), use_container_width=True)
        elif periodo == "Trimestral" and sistema.dre_trimestral is not None:
            st.dataframe(sistema.dre_trimestral.style.format("{:,.2f}"), use_container_width=True)
        elif periodo == "Anual" and sistema.dre_anual is not None:
            st.dataframe(sistema.dre_anual.style.format("{:,.2f}"), use_container_width=True)
    
    with tab3:
        st.header("Indicadores de Performance (KPIs)")
        
        if sistema.kpis is not None and not sistema.kpis.empty:
            st.dataframe(sistema.kpis.style.format("{:.2f}%"), use_container_width=True)
            
            # Gráfico de KPIs
            fig = px.line(
                sistema.kpis,
                title="Evolução dos KPIs",
                labels={'value': 'Percentual (%)', 'index': 'Período'}
            )
            fig.update_layout(height=400)
            st.plotly_chart(fig, use_container_width=True)
    
    with tab4:
        st.header("Flags de Coverage e Qualidade dos Dados")
        
        if sistema.flags is not None and not sistema.flags.empty:
            st.dataframe(sistema.flags, use_container_width=True)
            
            # Gráfico de barras por status
            status_counts = sistema.flags['status'].value_counts()
            fig = px.bar(
                x=status_counts.index,
                y=status_counts.values,
                title="Distribuição de Status por Categoria",
                labels={'x': 'Status', 'y': 'Quantidade'}
            )
            st.plotly_chart(fig, use_container_width=True)
            
            # Sources audit trail
            if sistema.sources is not None and not sistema.sources.empty:
                st.subheader("Audit Trail - Origem dos Dados")
                st.dataframe(sistema.sources, use_container_width=True)
    
    with tab5:
        st.header("Exportar Resultados")
        
        if st.button("📥 Gerar Arquivo Excel Completo"):
            with st.spinner("Gerando arquivo..."):
                sistema.exportar_resultados("resultados_analise_financeira.xlsx")
                
                with open("resultados_analise_financeira.xlsx", "rb") as f:
                    st.download_button(
                        label="⬇️ Baixar Excel",
                        data=f,
                        file_name="resultados_analise_financeira.xlsx",
                        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
        
        # Relatório texto
        if st.button("📄 Gerar Relatório Texto"):
            relatorio = sistema.gerar_relatorio_texto()
            st.text_area("Relatório", relatorio, height=400)
            
            st.download_button(
                label="⬇️ Baixar Relatório (.txt)",
                data=relatorio,
                file_name="relatorio_analise.txt",
                mime="text/plain"
            )

else:
    st.info("👈 Faça upload da planilha Excel e clique em 'Processar Dados' para começar.")
    
    st.markdown("""
    ### Como usar:
    1. **Upload da Planilha**: Faça upload do arquivo Excel com os dados financeiros
    2. **Upload Histórico (Opcional)**: Se tiver base histórica, faça upload do CSV
    3. **Processar**: Clique no botão "Processar Dados"
    4. **Visualizar**: Explore os resultados nas abas acima
    
    ### Funcionalidades:
    - ✅ Extração automática de Receitas e Despesas
    - ✅ Geração de DRE Mensal, Trimestral e Anual
    - ✅ Cálculo de KPIs (Margem Bruta, EBITDA, Margem Líquida)
    - ✅ Lógica inteligente de fallback histórico
    - ✅ Flags de qualidade dos dados
    - ✅ Audit trail completo
    """)

