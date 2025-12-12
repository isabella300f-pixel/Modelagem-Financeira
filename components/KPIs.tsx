'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface KPIsProps {
  data: any
}

export default function KPIs({ data }: KPIsProps) {
  const kpis = data?.kpis || []

  if (kpis.length === 0) {
    return <div className="card text-gray-400">Nenhum KPI disponível</div>
  }

  // Função auxiliar para buscar valor com variações de nome
  const getValue = (obj: any, ...keys: string[]) => {
    for (const key of keys) {
      if (obj && (obj[key] !== undefined && obj[key] !== null)) {
        const val = obj[key]
        if (typeof val === 'number' && !isNaN(val)) {
          return val
        }
      }
    }
    return 0
  }

  // Preparar dados para gráfico
  const chartData = kpis.map((kpi: any) => ({
    periodo: kpi.periodo || kpi.mes || kpi.year_month || '',
    'Margem Bruta': getValue(kpi, 'margem_bruta', 'Margem Bruta', 'margemBruta'),
    'Margem EBITDA': getValue(kpi, 'margem_ebitda', 'Margem EBITDA', 'margemEbitda'),
    'Margem Líquida': getValue(kpi, 'margem_liquida', 'Margem Líquida', 'margem_líquida', 'margemLiquida'),
  }))

  // Estilo customizado para Recharts no tema escuro
  const chartConfig = {
    grid: { stroke: '#2d3a4f' },
    axis: { stroke: '#b0b0b0', fill: '#b0b0b0' },
    tooltip: {
      backgroundColor: '#1a2332',
      border: '1px solid #3d4f6b',
      textStyle: { color: '#fff' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabela */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-white">Indicadores de Performance (KPIs)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#2d3a4f] border-b border-[#3d4f6b]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Período
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                  Margem Bruta
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                  Margem EBITDA
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                  Margem Líquida
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3a4f]">
              {kpis.map((kpi: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2a3a]'}>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {kpi.periodo || kpi.mes || `Período ${idx + 1}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {(() => {
                      const val = kpi.margem_bruta ?? kpi['Margem Bruta'] ?? 0
                      return val != null && !isNaN(val) ? Number(val).toFixed(2) : '0.00'
                    })()}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {(() => {
                      const val = kpi.margem_ebitda ?? kpi['Margem EBITDA'] ?? 0
                      return val != null && !isNaN(val) ? Number(val).toFixed(2) : '0.00'
                    })()}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
                    {(() => {
                      const val = kpi.margem_liquida ?? kpi['Margem Líquida'] ?? 0
                      return val != null && !isNaN(val) ? Number(val).toFixed(2) : '0.00'
                    })()}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-white">Evolução dos KPIs</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4f" />
            <XAxis dataKey="periodo" stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <YAxis stroke="#b0b0b0" tick={{ fill: '#b0b0b0' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a2332', 
                border: '1px solid #3d4f6b',
                color: '#fff',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="Margem Bruta" stroke="#60a5fa" strokeWidth={2} />
            <Line type="monotone" dataKey="Margem EBITDA" stroke="#34d399" strokeWidth={2} />
            <Line type="monotone" dataKey="Margem Líquida" stroke="#a78bfa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
