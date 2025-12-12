'use client'

import { useState } from 'react'

export default function TreinamentosPage() {
  const [trilhas] = useState([
    { 
      id: 1, 
      nome: 'Manual Operacional', 
      progresso: 100, 
      status: 'Concluído',
      itens: [
        { nome: 'Vídeo Introdução', tipo: 'video', concluido: true },
        { nome: 'PDF Completo', tipo: 'pdf', concluido: true },
        { nome: 'Quiz de Avaliação', tipo: 'quiz', concluido: true },
      ]
    },
    { 
      id: 2, 
      nome: 'Treinamento de Vendas', 
      progresso: 50, 
      status: 'Em andamento',
      itens: [
        { nome: 'Vídeo Técnicas de Vendas', tipo: 'video', concluido: true },
        { nome: 'PDF Guia de Vendas', tipo: 'pdf', concluido: true },
        { nome: 'Simulação Prática', tipo: 'video', concluido: false },
        { nome: 'Quiz Final', tipo: 'quiz', concluido: false },
      ]
    },
    { 
      id: 3, 
      nome: 'Capacitação para Líderes', 
      progresso: 0, 
      status: 'Pendente',
      itens: [
        { nome: 'Vídeo Liderança', tipo: 'video', concluido: false },
        { nome: 'PDF Gestão de Equipe', tipo: 'pdf', concluido: false },
      ]
    },
  ])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">📚 Treinamentos</h1>

        {/* Trilhas de Aprendizado */}
        <div className="space-y-6">
          {trilhas.map((trilha) => (
            <div key={trilha.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{trilha.nome}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Progresso</span>
                        <span className="text-white font-medium">{trilha.progresso}%</span>
                      </div>
                      <div className="w-full bg-[#2d3a4f] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            trilha.progresso === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${trilha.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${
                      trilha.status === 'Concluído' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : trilha.status === 'Em andamento'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                      {trilha.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {trilha.itens.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {item.tipo === 'video' ? '🎥' : item.tipo === 'pdf' ? '📄' : '🧪'}
                      </span>
                      <span className="text-white">{item.nome}</span>
                    </div>
                    {item.concluido ? (
                      <span className="text-green-400 text-sm">✓ Concluído</span>
                    ) : (
                      <button className="btn-secondary text-sm">
                        Iniciar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Biblioteca de Materiais */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Biblioteca de Materiais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f] hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">🎥</div>
              <div className="font-medium text-white mb-1">Vídeos</div>
              <div className="text-sm text-gray-400">15 vídeos disponíveis</div>
            </div>
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f] hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-medium text-white mb-1">PDFs</div>
              <div className="text-sm text-gray-400">12 documentos</div>
            </div>
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f] hover:border-[#3d6ba0] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">🧪</div>
              <div className="font-medium text-white mb-1">Quizzes</div>
              <div className="text-sm text-gray-400">8 avaliações</div>
            </div>
          </div>
        </div>

        {/* Área de Dúvidas e Tickets */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Dúvidas e Suporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-4">Abrir Ticket de Dúvida</h3>
              <textarea
                placeholder="Descreva sua dúvida sobre os treinamentos..."
                className="w-full h-32 px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white placeholder-gray-400"
              />
              <button className="mt-4 btn-primary">
                Enviar Dúvida
              </button>
            </div>
            <div>
              <h3 className="font-medium text-white mb-4">Tickets Abertos</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                  <div className="font-medium text-white text-sm">Dúvida sobre Quiz #123</div>
                  <div className="text-xs text-gray-400 mt-1">Em análise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

