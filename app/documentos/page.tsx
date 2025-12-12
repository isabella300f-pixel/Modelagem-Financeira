'use client'

import { useState } from 'react'

export default function DocumentosPage() {
  const [documentos] = useState([
    { id: 1, nome: 'Contrato da Franquia', tipo: 'Contrato', status: 'Vigente', vencimento: null, versao: 'v2.1' },
    { id: 2, nome: 'Manual de Marca', tipo: 'Manual', status: 'Atualizado', vencimento: null, versao: 'v3.0' },
    { id: 3, nome: 'Alvará de Funcionamento', tipo: 'Licença', status: 'Vencendo', vencimento: '2024-03-15', versao: 'v1.0' },
    { id: 4, nome: 'Política de Marketing', tipo: 'Política', status: 'Vigente', vencimento: null, versao: 'v1.2' },
  ])

  const [documentosPendentes] = useState([
    { id: 1, nome: 'Contrato de Aditivo - Expansão', tipo: 'Contrato', prazo: '2024-02-10' },
    { id: 2, nome: 'Declaração de Conformidade', tipo: 'Declaração', prazo: '2024-02-15' },
  ])

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">📁 Documentos</h1>
          <button className="btn-primary">
            📤 Enviar Documento
          </button>
        </div>

        {/* Alertas de Documentos Pendentes */}
        {documentosPendentes.length > 0 && (
          <div className="card border-yellow-500/50 bg-yellow-950/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-xl font-bold text-yellow-300">Documentos Pendentes</h2>
            </div>
            <div className="space-y-3">
              {documentosPendentes.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-[#1e2a3a] rounded-lg border border-yellow-500/30">
                  <div>
                    <div className="font-medium text-white">{doc.nome}</div>
                    <div className="text-sm text-gray-400">{doc.tipo} - Prazo: {new Date(doc.prazo).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <button className="btn-primary text-sm">
                    Assinar/Enviar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentos Disponíveis */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Documentos Disponíveis</h2>
          <div className="space-y-3">
            {documentos.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f] hover:border-[#3d6ba0] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{doc.nome}</div>
                    <div className="text-sm text-gray-400">
                      {doc.tipo} • Versão {doc.versao}
                      {doc.vencimento && ` • Vence em ${new Date(doc.vencimento).toLocaleDateString('pt-BR')}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    doc.status === 'Vigente' || doc.status === 'Atualizado' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="btn-secondary text-sm">
                    📥 Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Upload */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Enviar Documentos para Aceleradora</h2>
          <div className="border-2 border-dashed border-[#3d4f6b] rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📤</div>
            <p className="text-gray-300 mb-4">Arraste arquivos aqui ou clique para selecionar</p>
            <button className="btn-primary">
              Selecionar Arquivos
            </button>
            <p className="text-sm text-gray-400 mt-4">Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX (máx. 10MB)</p>
          </div>
        </div>

        {/* Assinatura Digital */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Área de Assinatura Digital</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <h3 className="font-medium text-white mb-4">Documentos Aguardando Assinatura</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Contrato de Aditivo</span>
                  <button className="btn-primary text-sm">Assinar</button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <h3 className="font-medium text-white mb-4">Histórico de Assinaturas</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Contrato da Franquia - 15/01/2023</div>
                <div>Manual de Marca - 20/12/2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

