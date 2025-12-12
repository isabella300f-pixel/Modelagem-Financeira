'use client'

interface FlagsProps {
  data: any
}

export default function Flags({ data }: FlagsProps) {
  const flags = data?.flags || []
  const sources = data?.sources

  if (flags.length === 0) {
    return <div className="card text-gray-400">Nenhum flag disponível</div>
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OK':
        return 'bg-green-950/30 text-green-300 border-green-500/50'
      case 'PARCIAL':
        return 'bg-yellow-950/30 text-yellow-300 border-yellow-500/50'
      case 'FALLBACK_HIST':
        return 'bg-red-950/30 text-red-300 border-red-500/50'
      default:
        return 'bg-gray-950/30 text-gray-300 border-gray-500/50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Flags Table */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 text-white">Flags de Coverage e Qualidade</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#2d3a4f] border-b border-[#3d4f6b]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Categoria
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">
                  Coverage
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3a4f]">
              {flags.map((flag: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2a3a]'}>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {flag.categoria || flag.category || `Categoria ${idx + 1}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-300">
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
          <h3 className="text-xl font-bold mb-4 text-white">Audit Trail - Origem dos Dados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#2d3a4f] border-b border-[#3d4f6b]">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                    Período
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                    Categoria
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">
                    Origem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3a4f]">
                {sources.slice(0, 50).map((source: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2a3a]'}>
                    <td className="px-4 py-2 text-gray-300">{source.periodo || '-'}</td>
                    <td className="px-4 py-2 text-gray-300">{source.categoria || '-'}</td>
                    <td className="px-4 py-2 text-gray-300">
                      <span className="px-2 py-1 bg-[#1e3a5f] text-blue-200 rounded text-xs border border-[#3d6ba0]">
                        {source.origem || source.source || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sources.length > 50 && (
              <p className="mt-4 text-sm text-gray-400 text-center">
                Mostrando 50 de {sources.length} registros
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
