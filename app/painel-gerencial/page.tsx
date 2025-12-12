'use client'

import { useState } from 'react'

export default function PainelGerencialPage() {
  const [franqueados] = useState([
    { id: 1, nome: 'Lages SC - Centro', faturamento: 125000, nps: 8.2, status: 'Excelente', posicao: 1 },
    { id: 2, nome: 'Florianópolis SC', faturamento: 118000, nps: 7.8, status: 'Bom', posicao: 2 },
    { id: 3, nome: 'Blumenau SC', faturamento: 95000, nps: 7.5, status: 'Bom', posicao: 3 },
  ])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">📈 Painel Gerencial</h1>

        {/* Indicadores Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-sm text-gray-400 mb-1">Total de Franqueados</div>
            <div className="text-3xl font-bold text-white">25</div>
            <div className="text-xs text-green-400 mt-2">↑ +3 este mês</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-400 mb-1">Faturamento Total</div>
            <div className="text-3xl font-bold text-white">R$ 2.5M</div>
            <div className="text-xs text-green-400 mt-2">↑ +12% vs mês anterior</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-400 mb-1">NPS Médio</div>
            <div className="text-3xl font-bold text-white">7.8</div>
            <div className="text-xs text-blue-400 mt-2">Mantido</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-400 mb-1">Compliance</div>
            <div className="text-3xl font-bold text-white">92%</div>
            <div className="text-xs text-green-400 mt-2">↑ +5% este mês</div>
          </div>
        </div>

        {/* Ranking de Performance */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Ranking de Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#2d3a4f] border-b border-[#3d4f6b]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Posição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Franqueado</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Faturamento</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">NPS</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3a4f]">
                {franqueados.map((franq, idx) => (
                  <tr key={franq.id} className={idx % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2a3a]'}>
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        franq.posicao === 1 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        franq.posicao === 2 ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
                        'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        {franq.posicao}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{franq.nome}</td>
                    <td className="px-4 py-3 text-right text-white">
                      R$ {franq.faturamento.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right text-white">{franq.nps}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs border ${
                        franq.status === 'Excelente' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {franq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visão Comparativa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">📊 Comparativo de Faturamento</h2>
            <div className="space-y-4">
              {franqueados.map((franq) => (
                <div key={franq.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{franq.nome}</span>
                    <span className="text-white font-medium">
                      R$ {franq.faturamento.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-[#2d3a4f] rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(franq.faturamento / 125000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">✅ Monitoramento de Compliance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <span className="text-white">Documentos em dia</span>
                <span className="text-green-400 font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <span className="text-white">Planilhas enviadas</span>
                <span className="text-green-400 font-bold">88%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <span className="text-white">Treinamentos concluídos</span>
                <span className="text-blue-400 font-bold">75%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas e Ações */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Alertas e Ações Necessárias</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
              <div>
                <div className="font-medium text-white">3 franqueados com DRE atrasada</div>
                <div className="text-sm text-gray-400">Ação: Enviar notificação</div>
              </div>
              <button className="btn-primary text-sm">
                Ver Detalhes
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-lg">
              <div>
                <div className="font-medium text-white">5 documentos vencendo em 15 dias</div>
                <div className="text-sm text-gray-400">Ação: Notificar renovações</div>
              </div>
              <button className="btn-secondary text-sm">
                Ver Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

