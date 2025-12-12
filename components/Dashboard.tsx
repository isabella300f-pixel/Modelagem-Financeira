'use client'

import { useState } from 'react'
import Metrics from './Metrics'
import DREView from './DREView'
import KPIs from './KPIs'
import Flags from './Flags'
import Charts from './Charts'
import ExportButtons from './ExportButtons'

interface DashboardProps {
  data: any
  onReset: () => void
}

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: '📈 Dashboard', icon: '📈' },
    { id: 'dre', label: '💰 DRE', icon: '💰' },
    { id: 'kpis', label: '🎯 KPIs', icon: '🎯' },
    { id: 'flags', label: '🚦 Flags', icon: '🚦' },
    { id: 'charts', label: '📊 Gráficos', icon: '📊' },
    { id: 'export', label: '📥 Exportar', icon: '📥' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header com botão reset */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Resultados da Análise</h2>
        <button onClick={onReset} className="btn-secondary">
          🔄 Nova Análise
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Metrics data={data} />
            <Charts data={data} />
          </div>
        )}

        {activeTab === 'dre' && <DREView data={data} />}
        {activeTab === 'kpis' && <KPIs data={data} />}
        {activeTab === 'flags' && <Flags data={data} />}
        {activeTab === 'charts' && <Charts data={data} fullView />}
        {activeTab === 'export' && <ExportButtons data={data} />}
      </div>
    </div>
  )
}

