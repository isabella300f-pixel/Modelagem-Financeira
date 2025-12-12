'use client'

import { useState } from 'react'

export default function ComunicacaoPage() {
  const [comunicados] = useState([
    { id: 1, titulo: 'Nova Política de Marketing', tipo: 'Política', data: '2024-02-01', lido: false },
    { id: 2, titulo: 'Campanha Sazonal - Verão', tipo: 'Campanha', data: '2024-01-28', lido: false },
    { id: 3, titulo: 'Atualização Operacional', tipo: 'Operacional', data: '2024-01-25', lido: true },
  ])

  const [chamados] = useState([
    { id: 1234, assunto: 'Dúvida sobre DRE', categoria: 'Financeiro', status: 'Em análise', data: '2024-02-02' },
  ])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">💬 Comunicação</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comunicados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Comunicados da Rede */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">📢 Comunicados da Rede</h2>
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  {comunicados.filter(c => !c.lido).length} novos
                </span>
              </div>
              <div className="space-y-3">
                {comunicados.map((com) => (
                  <div 
                    key={com.id} 
                    className={`p-4 rounded-lg border ${
                      !com.lido 
                        ? 'bg-[#1e3a5f]/20 border-[#3d6ba0]' 
                        : 'bg-[#1e2a3a] border-[#2d3a4f]'
                    } hover:border-[#3d6ba0] transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!com.lido && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                          <span className="font-medium text-white">{com.titulo}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {com.tipo} • {new Date(com.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Ler →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat com Consultor */}
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">💬 Chat com Consultor</h2>
              <div className="space-y-4 mb-4 h-64 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    C
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#1e2a3a] rounded-lg p-3 border border-[#2d3a4f]">
                      <p className="text-white text-sm">Olá! Como posso ajudá-lo hoje?</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block">Consultor - 10:30</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 flex justify-end">
                    <div className="bg-[#1e3a5f] rounded-lg p-3 border border-[#3d6ba0] max-w-xs">
                      <p className="text-white text-sm">Preciso de ajuda com o envio da DRE</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                    JS
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white placeholder-gray-400"
                />
                <button className="btn-primary">
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chamados */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">🆘 Meus Chamados</h3>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {chamados.length}
                </span>
              </div>
              <div className="space-y-3 mb-4">
                {chamados.map((chamado) => (
                  <div key={chamado.id} className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                    <div className="font-medium text-white text-sm mb-1">#{chamado.id}</div>
                    <div className="text-xs text-gray-400 mb-2">{chamado.assunto}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                        {chamado.status}
                      </span>
                      <span className="text-xs text-gray-400">{chamado.categoria}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary w-full text-sm">
                Abrir Novo Chamado
              </button>
            </div>

            {/* Agendamento */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">📅 Agendar Reunião</h3>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white">
                  <option>Selecione o tipo</option>
                  <option>Mentoria</option>
                  <option>Suporte Técnico</option>
                  <option>Financeiro</option>
                </select>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
                />
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
                />
                <button className="btn-primary w-full">
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

