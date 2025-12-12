'use client'

import { useState } from 'react'
import Metrics from './Metrics'
import DREView from './DREView'
import KPIs from './KPIs'
import Flags from './Flags'
import Charts from './Charts'
import ExportButtons from './ExportButtons'
import Logo from './Logo'

interface DashboardProps {
  data: any
  onReset: () => void
}

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📈' },
    { id: 'dre', label: 'DRE', icon: '💰' },
    { id: 'kpis', label: 'KPIs', icon: '🎯' },
    { id: 'flags', label: 'Flags', icon: '🚦' },
    { id: 'charts', label: 'Gráficos', icon: '📊' },
    { id: 'export', label: 'Exportar', icon: '📥' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header com Logo */}
        <div className="mb-6 border-b border-[#3d4f6b] pb-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="text-right">
              <h2 className="text-2xl font-bold text-white">Resultados da Análise</h2>
              <button 
                onClick={onReset} 
                className="mt-2 btn-secondary text-sm"
              >
                🔄 Nova Análise
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6 p-0 overflow-hidden">
          <div className="flex border-b border-[#2d3a4f] overflow-x-auto bg-[#1a2332]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-[#3d6ba0] bg-[#1e3a5f]/30'
                    : 'text-gray-400 hover:text-white hover:border-[#3d6ba0]/50 border-transparent'
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
    </div>
  )
}
