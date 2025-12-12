'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ManualInput from '@/components/ManualInput'
import Dashboard from '@/components/Dashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
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

      if (manualData) {
        // Processar dados manuais
        response = await fetch('/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ manualData }),
        })
      } else if (excelFile || manualData) {
        // Processar arquivo Excel (com ou sem dados manuais)
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

        response = await fetch('/api/process', {
          method: 'POST',
          body: formData,
        })
      } else {
        throw new Error('Nenhum dado fornecido')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao processar dados')
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Análise Financeira
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de DRE com Fallback Histórico Inteligente
          </p>
        </div>

        {/* Mode Selector */}
        {!data && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Escolha o método de entrada:</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setInputMode('file')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    inputMode === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  📄 Upload de Arquivo Excel
                </button>
                <button
                  onClick={() => setInputMode('manual')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    inputMode === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
              <FileUpload onProcess={(file, hist) => handleProcess(file, hist)} loading={loading} />
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">❌ Erro</h3>
              <p className="text-red-600">{error}</p>
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
    </main>
  )
}

