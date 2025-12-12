'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardFranqueado() {
  const [tarefas] = useState([
    { id: 1, titulo: 'Enviar DRE de Janeiro', prioridade: 'alta', prazo: '2024-02-05' },
    { id: 2, titulo: 'Atualizar alvará de funcionamento', prioridade: 'media', prazo: '2024-02-10' },
    { id: 3, titulo: 'Assistir treinamento de vendas', prioridade: 'baixa', prazo: '2024-02-15' },
  ])

  const [indicadores] = useState({
    faturamento_mes: 125000,
    ticket_medio: 85.50,
    meta_mes: 150000,
    nps: 8.2,
    planilhas_status: 'em_dia',
  })

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              👋 Boas-vindas, João da Silva
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
                ✓ Status: Ativa
              </span>
              <span className="text-sm text-gray-400">
                Última atualização: 02/02/2024
              </span>
            </div>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Treinamentos */}
          <div className="card hover:border-[#3d6ba0] transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">📚 Treinamentos</h3>
                <p className="text-sm text-gray-400">Acesso rápido aos materiais</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Manual Operacional</span>
                <span className="text-green-400">✓ Concluído</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Treinamento de Vendas</span>
                <span className="text-yellow-400">50%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Capacitação Líderes</span>
                <span className="text-gray-400">Pendente</span>
              </div>
            </div>
            <Link href="/treinamentos" className="btn-primary w-full text-center block">
              Acessar Plataforma
            </Link>
          </div>

          {/* Documentos */}
          <div className="card hover:border-[#3d6ba0] transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">📁 Documentos</h3>
                <p className="text-sm text-gray-400">Repositório de documentos</p>
              </div>
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">2</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-300">Contrato da Franquia</div>
              <div className="text-sm text-gray-300">Manual de Marca</div>
              <div className="text-sm text-gray-300">Checklists operacionais</div>
            </div>
            <Link href="/documentos" className="btn-secondary w-full text-center block">
              Ver Documentos
            </Link>
          </div>

          {/* Indicadores */}
          <div className="card hover:border-[#3d6ba0] transition-colors cursor-pointer">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">📊 Indicadores</h3>
              <p className="text-sm text-gray-400">Resumo do desempenho</p>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Faturamento</span>
                  <span className="text-white font-bold">
                    R$ {indicadores.faturamento_mes.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="w-full bg-[#2d3a4f] rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(indicadores.faturamento_mes / indicadores.meta_mes) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Ticket Médio</span>
                <span className="text-white font-bold">R$ {indicadores.ticket_medio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">NPS</span>
                <span className="text-green-400 font-bold">{indicadores.nps}</span>
              </div>
            </div>
            <Link href="/planilhas" className="btn-secondary w-full text-center block">
              Ver Painel Completo
            </Link>
          </div>

          {/* Suporte */}
          <div className="card hover:border-[#3d6ba0] transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🆘 Suporte</h3>
                <p className="text-sm text-gray-400">Chamados e atendimento</p>
              </div>
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">1</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-300">Chamado #1234 - Em análise</div>
              <div className="text-sm text-gray-400">Financeiro</div>
            </div>
            <Link href="/comunicacao" className="btn-primary w-full text-center block">
              Abrir Chamado
            </Link>
          </div>
        </div>

        {/* Tarefas e Pendências */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">📝 Tarefas e Pendências</h2>
            <Link href="/operacional" className="text-sm text-blue-400 hover:text-blue-300">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {tarefas.map((tarefa) => (
              <div 
                key={tarefa.id} 
                className="flex items-center gap-4 p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f] hover:border-[#3d6ba0] transition-colors"
              >
                <input type="checkbox" className="w-5 h-5 rounded border-[#3d4f6b] bg-[#1a2332] text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{tarefa.titulo}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      tarefa.prioridade === 'alta' ? 'bg-red-950/30 text-red-300' :
                      tarefa.prioridade === 'media' ? 'bg-yellow-950/30 text-yellow-300' :
                      'bg-gray-950/30 text-gray-300'
                    }`}>
                      {tarefa.prioridade}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Prazo: {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}</span>
                </div>
                <button className="btn-secondary text-sm">
                  Concluir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas 2 Linhas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agenda e Eventos */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📅 Agenda e Eventos</h3>
              <Link href="/comunicacao" className="text-sm text-blue-400 hover:text-blue-300">
                Ver calendário →
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400">📅</span>
                  <span className="font-medium text-white">Reunião com Consultor</span>
                </div>
                <span className="text-sm text-gray-400">05/02/2024 - 14:00</span>
              </div>
              <div className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">🎥</span>
                  <span className="font-medium text-white">Live da Rede</span>
                </div>
                <span className="text-sm text-gray-400">10/02/2024 - 19:00</span>
              </div>
            </div>
            <button className="mt-4 btn-secondary w-full">
              Agendar Reunião
            </button>
          </div>

          {/* Comunicados */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📢 Comunicados da Rede</h3>
              <Link href="/comunicacao" className="text-sm text-blue-400 hover:text-blue-300">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-red-400">🔴</span>
                  <div className="flex-1">
                    <span className="font-medium text-white block">Nova Política de Marketing</span>
                    <span className="text-xs text-gray-400">01/02/2024</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-blue-400">🔵</span>
                  <div className="flex-1">
                    <span className="font-medium text-white block">Campanha Sazonal - Verão</span>
                    <span className="text-xs text-gray-400">28/01/2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
