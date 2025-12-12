'use client'

interface MetricsProps {
  data: any
}

export default function Metrics({ data }: MetricsProps) {
  const dreMensal = data?.dre_mensal
  if (!dreMensal || dreMensal.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-400">Nenhum dado disponível. Processe uma análise primeiro.</p>
      </div>
    )
  }

  // Pegar o último mês com dados válidos (não zero)
  let ultimoMes = null
  for (let i = dreMensal.length - 1; i >= 0; i--) {
    const mes = dreMensal[i]
    if (mes && (mes.receita_liquida || mes.receita_líquida || mes['Receita Líquida'])) {
      ultimoMes = mes
      break
    }
  }
  if (!ultimoMes) {
    ultimoMes = dreMensal[dreMensal.length - 1]
  }

  const kpis = data?.kpis
  let ultimoKPI = null
  if (kpis && kpis.length > 0) {
    for (let i = kpis.length - 1; i >= 0; i--) {
      const kpi = kpis[i]
      if (kpi && (kpi.margem_liquida || kpi.margem_líquida || kpi['Margem Líquida'])) {
        ultimoKPI = kpi
        break
      }
    }
    if (!ultimoKPI) {
      ultimoKPI = kpis[kpis.length - 1]
    }
  }

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
    blue: 'border-blue-400/50 bg-blue-950/20 text-blue-200',
    green: 'border-green-400/50 bg-green-950/20 text-green-200',
    red: 'border-red-400/50 bg-red-950/20 text-red-200',
    purple: 'border-purple-400/50 bg-purple-950/20 text-purple-200',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className={`card border-2 ${colorClasses[metric.color as keyof typeof colorClasses]}`}
        >
          <h3 className="text-sm font-medium mb-2 text-gray-300">{metric.label}</h3>
          <p className="text-2xl font-bold">
            {formatValue(metric.value, metric.format)}
          </p>
        </div>
      ))}
    </div>
  )
}
