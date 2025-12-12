'use client'

import { useState } from 'react'

export default function OperacionalPage() {
  const [checklists] = useState([
    { 
      id: 1, 
      nome: 'Checklist de Implantação', 
      tipo: 'Implantação',
      itens: [
        { id: 1, descricao: 'Assinatura de contrato', concluido: true },
        { id: 2, descricao: 'Alvará de funcionamento', concluido: true },
        { id: 3, descricao: 'Treinamento inicial', concluido: false },
        { id: 4, descricao: 'Instalação de equipamentos', concluido: false },
      ]
    },
    { 
      id: 2, 
      nome: 'Checklist Operacional Mensal', 
      tipo: 'Rotina',
      itens: [
        { id: 1, descricao: 'Envio de DRE', concluido: true },
        { id: 2, descricao: 'Relatório de vendas', concluido: true },
        { id: 3, descricao: 'Fotos do estabelecimento', concluido: false },
        { id: 4, descricao: 'Checklist de qualidade', concluido: false },
      ]
    },
  ])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">📝 Gestão Operacional</h1>

        {/* Checklists */}
        <div className="space-y-6">
          {checklists.map((checklist) => (
            <div key={checklist.id} className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{checklist.nome}</h2>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                    {checklist.tipo}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {checklist.itens.filter(i => i.concluido).length}/{checklist.itens.length}
                  </div>
                  <div className="text-sm text-gray-400">Itens concluídos</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {checklist.itens.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]"
                  >
                    <input 
                      type="checkbox" 
                      checked={item.concluido}
                      className="w-5 h-5 rounded border-[#3d4f6b] bg-[#1a2332] text-blue-600"
                    />
                    <span className={`flex-1 ${item.concluido ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item.descricao}
                    </span>
                    {!item.concluido && (
                      <button className="btn-secondary text-sm">
                        Anexar Evidência
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Envio de Evidências */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">📸 Envio de Fotos e Evidências</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-[#3d4f6b] rounded-lg p-8 text-center hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm text-gray-300">Adicionar Foto</div>
            </div>
            <div className="border-2 border-dashed border-[#3d4f6b] rounded-lg p-8 text-center hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-sm text-gray-300">Adicionar Documento</div>
            </div>
            <div className="border-2 border-dashed border-[#3d4f6b] rounded-lg p-8 text-center hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-4xl mb-2">➕</div>
              <div className="text-sm text-gray-300">Nova Evidência</div>
            </div>
          </div>
        </div>

        {/* Pendências */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Pendências</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-500/30 rounded-lg">
              <div>
                <div className="font-medium text-white">Treinamento inicial pendente</div>
                <div className="text-sm text-gray-400">Prazo: 15/02/2024</div>
              </div>
              <button className="btn-primary text-sm">
                Resolver
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-lg">
              <div>
                <div className="font-medium text-white">Fotos do estabelecimento</div>
                <div className="text-sm text-gray-400">Prazo: 20/02/2024</div>
              </div>
              <button className="btn-secondary text-sm">
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Relatórios Automáticos */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">📊 Relatórios Automáticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="font-medium text-white mb-2">Relatório de Implantação</div>
              <div className="text-sm text-gray-400 mb-4">Última atualização: 01/02/2024</div>
              <button className="btn-secondary text-sm w-full">
                Ver Relatório
              </button>
            </div>
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="font-medium text-white mb-2">Relatório Operacional</div>
              <div className="text-sm text-gray-400 mb-4">Última atualização: 02/02/2024</div>
              <button className="btn-secondary text-sm w-full">
                Ver Relatório
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

