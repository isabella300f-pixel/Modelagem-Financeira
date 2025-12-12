'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartsProps {
  data: any
  fullView?: boolean
}

export default function Charts({ data, fullView = false }: ChartsProps) {
  const dreMensal = data?.dre_mensal || []

  if (dreMensal.length === 0) {
    return <div className="card">Nenhum dado disponível para gráficos</div>
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

  return (
    <div className={`space-y-6 ${fullView ? '' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
      {/* Evolução Financeira */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Evolução Financeira Mensal</h3>
        <ResponsiveContainer width="100%" height={fullView ? 500 : 300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
            <Legend />
            <Line type="monotone" dataKey="Receita Líquida" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="EBITDA" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Resultado Líquido" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparação de Receitas e Custos */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Receita vs Resultado</h3>
        <ResponsiveContainer width="100%" height={fullView ? 500 : 300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
            <Legend />
            <Bar dataKey="Receita Líquida" fill="#3b82f6" />
            <Bar dataKey="Resultado Líquido" fill={chartData[chartData.length - 1]?.resultado_liquido >= 0 ? '#10b981' : '#ef4444'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

