'use client'

interface MetricsProps {
  data: any
}

export default function Metrics({ data }: MetricsProps) {
  const dreMensal = data?.dre_mensal
  if (!dreMensal || dreMensal.length === 0) return null

  const ultimoMes = dreMensal[dreMensal.length - 1]
  const kpis = data?.kpis
  const ultimoKPI = kpis && kpis.length > 0 ? kpis[kpis.length - 1] : null

  // Normalizar busca de valores (tentar diferentes variações de nome)
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

  const metrics = [
    {
      label: 'Receita Líquida',
      value: getValue(ultimoMes, 'receita_liquida', 'Receita Líquida', 'receita_líquida', 'receitaLiquida'),
      format: 'currency',
      color: 'blue',
    },
    {
      label: 'EBITDA',
      value: getValue(ultimoMes, 'ebitda', 'EBITDA'),
      format: 'currency',
      color: 'green',
    },
    {
      label: 'Resultado Líquido',
      value: getValue(ultimoMes, 'resultado_liquido', 'Resultado Líquido', 'resultado_líquido', 'resultadoLiquido'),
      format: 'currency',
      color: getValue(ultimoMes, 'resultado_liquido', 'Resultado Líquido', 'resultado_líquido', 'resultadoLiquido') >= 0 ? 'green' : 'red',
    },
    {
      label: 'Margem Líquida',
      value: getValue(ultimoKPI, 'margem_liquida', 'Margem Líquida', 'margem_líquida', 'margemLiquida'),
      format: 'percent',
      color: 'purple',
    },
  ]

  const formatValue = (value: number, format: string) => {
    // Tratar NaN e null
    if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
      return format === 'currency' ? 'R$ 0,00' : '0.00%'
    }

    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    }
    if (format === 'percent') {
      return `${Number(value).toFixed(2)}%`
    }
    return Number(value).toLocaleString('pt-BR')
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`card border-2 ${colorClasses[metric.color as keyof typeof colorClasses]}`}
        >
          <h3 className="text-sm font-medium mb-2">{metric.label}</h3>
          <p className="text-2xl font-bold">
            {formatValue(metric.value, metric.format)}
          </p>
        </div>
      ))}
    </div>
  )
}

