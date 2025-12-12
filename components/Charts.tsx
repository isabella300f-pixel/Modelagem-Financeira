'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartsProps {
  data: any
  fullView?: boolean
}

export default function Charts({ data, fullView = false }: ChartsProps) {
  const dreMensal = data?.dre_mensal || []

  if (dreMensal.length === 0) {
    return <div className="card text-gray-400">Nenhum dado disponível para gráficos</div>
  }

  // Função auxiliar para buscar valor com variações de nome
  const getValue = (row: any, ...keys: string[]) => {
    for (const key of keys) {
      if (row && (row[key] !== undefined && row[key] !== null)) {
        const val = row[key]
        if (typeof val === 'number' && !isNaN(val)) {
          return val
        }
      }
    }
    return 0
  }

  // Preparar dados para gráficos
  const chartData = dreMensal.map((row: any) => ({
    periodo: row.periodo || row.mes || row.year_month || '',
    'Receita Líquida': getValue(row, 'receita_liquida', 'Receita Líquida', 'receita_líquida', 'receitaLiquida'),
    'EBITDA': getValue(row, 'ebitda', 'EBITDA'),
    'Resultado Líquido': getValue(row, 'resultado_liquido', 'Resultado Líquido', 'resultado_líquido', 'resultadoLiquido'),
    'Lucro Bruto': getValue(row, 'lucro_bruto', 'Lucro Bruto', 'lucroBruto'),
  }))

  const tooltipStyle = {
    backgroundColor: '#1a2332',
    border: '1px solid #3d4f6b',
    borderRadius: '8px',
    color: '#fff'
  }

  return (
    <div className={`space-y-6 ${fullView ? '' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
      {/* Evolução Financeira */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-white">Evolução Financeira Mensal</h3>
        <ResponsiveContainer width="100%" height={fullView ? 500 : 300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" />
            <XAxis dataKey="periodo" stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <YAxis stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="Receita Líquida" stroke="#60a5fa" strokeWidth={2} />
            <Line type="monotone" dataKey="EBITDA" stroke="#34d399" strokeWidth={2} />
            <Line type="monotone" dataKey="Resultado Líquido" stroke="#fbbf24" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparação de Receitas e Custos */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-white">Receita vs Resultado</h3>
        <ResponsiveContainer width="100%" height={fullView ? 500 : 300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" />
            <XAxis dataKey="periodo" stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <YAxis stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="Receita Líquida" fill="#60a5fa" />
            <Bar dataKey="Resultado Líquido" fill={chartData[chartData.length - 1]?.resultado_liquido >= 0 ? '#34d399' : '#ef4444'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
