'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ManualInput from '@/components/ManualInput'
import Dashboard from '@/components/Dashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function PlanilhasPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'file' | 'manual'>('file')

  const handleProcess = async (excelFile?: File, historicalFile?: File, manualData?: any) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      let response

      // Se só tem dados manuais (sem arquivo), usar JSON
      if (manualData && !excelFile && !historicalFile) {
        response = await fetch('/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manualData }),
        })
      } else {
        // Se tem arquivo ou ambos, usar FormData
        const formData = new FormData()
        if (excelFile) {
          formData.append('excel', excelFile)
        }
        if (historicalFile) {
          formData.append('historical', historicalFile)
        }
        if (manualData) {
          formData.append('manualData', JSON.stringify(manualData))
        }

        if (formData.entries().next().done && !manualData) {
          throw new Error('Nenhum dado fornecido')
        }

        response = await fetch('/api/process', {
          method: 'POST',
          body: formData,
        })
      }

      if (!response.ok) {
        let errorMessage = 'Erro ao processar dados'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Resposta não é JSON:', text.substring(0, 200))
        throw new Error('Resposta inválida do servidor')
      }

      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido ao processar')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📊 Área de Planilhas</h1>
          <p className="text-gray-400">
            Envie suas planilhas financeiras e acompanhe os indicadores gerados automaticamente
          </p>
        </div>

        {/* Histórico de Envios */}
        {!data && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Histórico de Envios</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div>
                  <span className="font-medium text-white">DRE - Janeiro 2024</span>
                  <span className="text-sm text-gray-400 block">Enviado em 01/02/2024</span>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  ✓ Em dia
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <div>
                  <span className="font-medium text-white">DRE - Dezembro 2023</span>
                  <span className="text-sm text-gray-400 block">Enviado em 03/01/2024</span>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  ✓ Em dia
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector */}
        {!data && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-white">Escolha o método de entrada:</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setInputMode('file')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    inputMode === 'file'
                      ? 'bg-[#1e3a5f] text-white border border-[#3d6ba0]'
                      : 'bg-[#1a2332] text-gray-300 hover:bg-[#2d3a4f] border border-[#2d3a4f]'
                  }`}
                >
                  📄 Upload de Arquivo Excel
                </button>
                <button
                  onClick={() => setInputMode('manual')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    inputMode === 'manual'
                      ? 'bg-[#1e3a5f] text-white border border-[#3d6ba0]'
                      : 'bg-[#1a2332] text-gray-300 hover:bg-[#2d3a4f] border border-[#2d3a4f]'
                  }`}
                >
                  ✏️ Entrada Manual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        {!data && (
          <div className="max-w-4xl mx-auto">
            {inputMode === 'file' ? (
              <FileUpload onProcess={(file, hist, manual) => handleProcess(file ?? undefined, hist, manual)} loading={loading} />
            ) : (
              <ManualInput onProcess={(data) => handleProcess(undefined, undefined, data)} loading={loading} />
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-4xl mx-auto mt-8">
            <LoadingSpinner message="Processando dados... Isso pode levar alguns segundos." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="card border-red-500/50 bg-red-950/20">
              <h3 className="text-red-400 font-semibold mb-2">❌ Erro</h3>
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setData(null)
                }}
                className="mt-4 btn-secondary"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {data && !loading && (
          <Dashboard data={data} onReset={() => setData(null)} />
        )}
      </div>
    </div>
  )
}

