'use client'

interface FlagsProps {
  data: any
}

export default function Flags({ data }: FlagsProps) {
  const flags = data?.flags || []
  const sources = data?.sources

  if (flags.length === 0) {
    return <div className="card">Nenhum flag disponível</div>
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OK':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PARCIAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'FALLBACK_HIST':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Flags Table */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Flags de Coverage e Qualidade</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoria
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Coverage
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flags.map((flag: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {flag.categoria || flag.category || `Categoria ${idx + 1}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    {((flag.coverage_pct || flag.coverage || 0) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        flag.status
                      )}`}
                    >
                      {flag.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources Audit Trail */}
      {sources && sources.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Audit Trail - Origem dos Dados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Período
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Categoria
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Origem
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sources.slice(0, 50).map((source: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-gray-700">{source.periodo || '-'}</td>
                    <td className="px-4 py-2 text-gray-700">{source.categoria || '-'}</td>
                    <td className="px-4 py-2 text-gray-700">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {source.origem || source.source || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sources.length > 50 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Mostrando 50 de {sources.length} registros
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

