'use client'

import { useState } from 'react'

interface DREViewProps {
  data: any
}

export default function DREView({ data }: DREViewProps) {
  const [period, setPeriod] = useState<'mensal' | 'trimestral' | 'anual'>('mensal')

  const dreData = period === 'mensal' 
    ? data?.dre_mensal 
    : period === 'trimestral' 
    ? data?.dre_trimestral 
    : data?.dre_anual

  if (!dreData || dreData.length === 0) {
    return <div className="card">Nenhum dado DRE disponível</div>
  }

  const formatCurrency = (value: any) => {
    // Tratar NaN, null, undefined
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return 'R$ 0,00'
    }
    const numValue = Number(value)
    if (isNaN(numValue)) {
      return 'R$ 0,00'
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
  }

  // Obter todas as linhas do DRE (excluir periodo e year_month)
  const dreLines = dreData[0] ? Object.keys(dreData[0]).filter(k => k !== 'periodo' && k !== 'year_month' && k !== 'mes' && k !== 'trimestre' && k !== 'ano') : []
  const periods = dreData.map((row: any) => row.periodo || row.year_month || row.mes || row.trimestre || row.ano || '')

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Demonstração do Resultado do Exercício</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="mensal">Mensal</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Linha DRE
              </th>
              {periods.map((p: string, idx: number) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dreLines.map((line: string, lineIdx: number) => (
              <tr key={lineIdx} className={lineIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{line}</td>
                {dreData.map((row: any, periodIdx: number) => {
                  // Buscar valor com diferentes variações de nome
                  const value = row[line] ?? 
                               row[line.toLowerCase()] ?? 
                               row[line.replace(/\s+/g, '_').toLowerCase()] ??
                               row[line.replace(/\s+/g, '_').toLowerCase().replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')] ??
                               0
                  return (
                    <td key={periodIdx} className="px-4 py-3 text-sm text-right text-gray-700">
                      {formatCurrency(value)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

