'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface KPIsProps {
  data: any
}

export default function KPIs({ data }: KPIsProps) {
  const kpis = data?.kpis || []

  if (kpis.length === 0) {
    return <div className="card">Nenhum KPI disponível</div>
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

  return (
    <div className="space-y-6">
      {/* Tabela */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Indicadores de Performance (KPIs)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Período
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Margem Bruta
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Margem EBITDA
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Margem Líquida
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kpis.map((kpi: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {kpi.periodo || kpi.mes || `Período ${idx + 1}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    {(() => {
                      const val = kpi.margem_bruta ?? kpi['Margem Bruta'] ?? 0
                      return val != null && !isNaN(val) ? Number(val).toFixed(2) : '0.00'
                    })()}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    {(() => {
                      const val = kpi.margem_ebitda ?? kpi['Margem EBITDA'] ?? 0
                      return val != null && !isNaN(val) ? Number(val).toFixed(2) : '0.00'
                    })()}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
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
        <h3 className="text-xl font-bold mb-4">Evolução dos KPIs</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Margem Bruta" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Margem EBITDA" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Margem Líquida" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

