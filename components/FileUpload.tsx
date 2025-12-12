'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  onProcess: (excelFile: File | null, historicalFile?: File, manualData?: any) => void
  loading: boolean
}

interface ManualRow {
  mes: string
  categoria: string
  descricao?: string
  valor: number
  tipo: 'entrada' | 'saida'
}

const TIPOS_NEGOCIO = ['Bar', 'Restaurante', 'Salão de Beleza', 'Academia', 'Home Office', 'Loja', 'Serviços', 'Outros']
const ESTADOS = [
  'Acre (AC)', 'Alagoas (AL)', 'Amapá (AP)', 'Amazonas (AM)', 'Bahia (BA)',
  'Ceará (CE)', 'Distrito Federal (DF)', 'Espírito Santo (ES)', 'Goiás (GO)',
  'Maranhão (MA)', 'Mato Grosso (MT)', 'Mato Grosso do Sul (MS)', 'Minas Gerais (MG)',
  'Pará (PA)', 'Paraíba (PB)', 'Paraná (PR)', 'Pernambuco (PE)', 'Piauí (PI)',
  'Rio de Janeiro (RJ)', 'Rio Grande do Norte (RN)', 'Rio Grande do Sul (RS)',
  'Rondônia (RO)', 'Roraima (RR)', 'Santa Catarina (SC)', 'São Paulo (SP)',
  'Sergipe (SE)', 'Tocantins (TO)'
]

const CIDADE_POR_ESTADO: Record<string, string[]> = {
  'Santa Catarina (SC)': ['Lages', 'Florianópolis', 'Blumenau', 'Joinville', 'Chapecó', 'Criciúma'],
  'São Paulo (SP)': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
  'Minas Gerais (MG)': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
}

export default function FileUpload({ onProcess, loading }: FileUploadProps) {
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [historicalFile, setHistoricalFile] = useState<File | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [infoBasica, setInfoBasica] = useState({
    nome_cliente: '',
    nome_estabelecimento: '',
    tipo_negocio: '',
    estado: '',
    cidade: '',
    capital_investido: '',
    ticket_medio: '',
    capacidade: '',
  })
  const [manualReceitas, setManualReceitas] = useState<ManualRow[]>([{ mes: '2024-01', categoria: 'Receita', valor: 0, tipo: 'entrada' }])
  const [manualDespesas, setManualDespesas] = useState<ManualRow[]>([{ mes: '2024-01', categoria: 'Despesa Operacional', valor: 0, tipo: 'saida' }])
  const excelInputRef = useRef<HTMLInputElement>(null)
  const historicalInputRef = useRef<HTMLInputElement>(null)

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0])
    }
  }

  const handleHistoricalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHistoricalFile(e.target.files[0])
    }
  }

  const categoriasDespesa = [
    'Despesa Operacional',
    'Despesa Administrativa',
    'Despesa de Marketing',
    'Custo dos Serviços/Vendas (COGS)',
    'Pessoal',
    'Impostos',
    'Utilidades',
    'Manutenção',
    'Outras Despesas',
  ]

  const addManualReceita = () => {
    setManualReceitas([...manualReceitas, { mes: '2024-01', categoria: 'Receita', valor: 0, tipo: 'entrada' }])
  }

  const addManualDespesa = () => {
    setManualDespesas([...manualDespesas, { mes: '2024-01', categoria: 'Despesa Operacional', valor: 0, tipo: 'saida' }])
  }

  const updateManualRow = (index: number, field: string, value: any, type: 'receita' | 'despesa') => {
    if (type === 'receita') {
      const newRows = [...manualReceitas]
      newRows[index] = { ...newRows[index], [field]: value }
      setManualReceitas(newRows)
    } else {
      const newRows = [...manualDespesas]
      newRows[index] = { ...newRows[index], [field]: value }
      setManualDespesas(newRows)
    }
  }

  const removeManualRow = (index: number, type: 'receita' | 'despesa') => {
    if (type === 'receita') {
      setManualReceitas(manualReceitas.filter((_, i) => i !== index))
    } else {
      setManualDespesas(manualDespesas.filter((_, i) => i !== index))
    }
  }

  const updateInfoBasica = (field: string, value: string) => {
    setInfoBasica({ ...infoBasica, [field]: value })
    // Se mudou o estado, resetar cidade
    if (field === 'estado') {
      setInfoBasica(prev => ({ ...prev, estado: value, cidade: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Preparar dados manuais se houver (receitas/despesas ou info básica)
    let manualData: any = null
    const temReceitasDespesas = manualReceitas.some(r => r.valor > 0) || manualDespesas.some(d => d.valor > 0)
    const temInfoBasica = Object.values(infoBasica).some(v => v && v.toString().trim() !== '')
    
    if (showManual && (temReceitasDespesas || temInfoBasica)) {
      manualData = {
        info_basica: temInfoBasica ? infoBasica : undefined,
        receitas: manualReceitas
          .filter(r => r.valor > 0)
          .map(r => ({
            data: `${r.mes}-01`,
            categoria: r.categoria,
            tipo_servico: 'Entrada Manual',
            valor: parseFloat(r.valor.toString()) || 0,
            tipo: 'entrada',
            fonte: 'Manual'
          })),
        despesas: manualDespesas
          .filter(d => d.valor > 0)
          .map(d => ({
            data: `${d.mes}-01`,
            categoria: d.categoria,
            subcategoria: d.descricao || d.categoria,
            valor: parseFloat(d.valor.toString()) || 0,
            tipo: 'saida',
            fonte: 'Manual'
          }))
      }
    }

    onProcess(excelFile, historicalFile || undefined, manualData || undefined)
  }

  const cidadesDisponiveis = infoBasica.estado 
    ? (CIDADE_POR_ESTADO[infoBasica.estado] || [])
    : []

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload de Arquivos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Excel File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planilha Excel (Opcional)
          </label>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelChange}
            className="input-file text-gray-700"
            disabled={loading}
          />
          {excelFile && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {excelFile.name}
            </p>
          )}
        </div>

        {/* Historical File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Histórica CSV (Opcional)
          </label>
          <input
            ref={historicalInputRef}
            type="file"
            accept=".csv"
            onChange={handleHistoricalChange}
            className="input-file text-gray-700"
            disabled={loading}
          />
          {historicalFile && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {historicalFile.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Use base histórica para melhorar a precisão quando dados atuais forem insuficientes
          </p>
        </div>

        {/* Adicionar Dados Manuais */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            {showManual ? '▼ Ocultar' : '▶ Adicionar Dados Manuais'} Dados Adicionais
          </button>

          {showManual && (
            <div className="mt-4 space-y-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                💡 Adicione receitas ou despesas manuais que serão combinadas com os dados do arquivo Excel
              </p>

              {/* Informações Básicas */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Informações do Negócio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Nome do Cliente */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      value={infoBasica.nome_cliente}
                      onChange={(e) => updateInfoBasica('nome_cliente', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Nome do Estabelecimento */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nome do Estabelecimento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Bar do João"
                      value={infoBasica.nome_estabelecimento}
                      onChange={(e) => updateInfoBasica('nome_estabelecimento', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Tipo de Negócio */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tipo de negócio
                    </label>
                    <select
                      value={infoBasica.tipo_negocio}
                      onChange={(e) => updateInfoBasica('tipo_negocio', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    >
                      <option value="">Selecione...</option>
                      {TIPOS_NEGOCIO.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={infoBasica.estado}
                      onChange={(e) => updateInfoBasica('estado', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    >
                      <option value="">Selecione...</option>
                      {ESTADOS.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <select
                      value={infoBasica.cidade}
                      onChange={(e) => updateInfoBasica('cidade', e.target.value)}
                      disabled={!infoBasica.estado}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecione...</option>
                      {cidadesDisponiveis.map(cidade => (
                        <option key={cidade} value={cidade}>{cidade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Capital Investido */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Capital investido (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 8000"
                      value={infoBasica.capital_investido}
                      onChange={(e) => updateInfoBasica('capital_investido', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Ticket Médio */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ticket médio por cliente (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 120"
                      value={infoBasica.ticket_medio}
                      onChange={(e) => updateInfoBasica('ticket_medio', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  {/* Capacidade */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Capacidade / clientes por mês (opcional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 1200"
                      value={infoBasica.capacidade}
                      onChange={(e) => updateInfoBasica('capacidade', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-gray-600">
                  💡 <strong>Dica:</strong> Campos não preenchidos serão buscados automaticamente da planilha base.
                </p>
              </div>

              {/* Receitas Manuais */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700">Receitas Adicionais</h4>
                  <button type="button" onClick={addManualReceita} className="text-sm btn-secondary">
                    + Receita
                  </button>
                </div>
                <div className="space-y-2">
                  {manualReceitas.map((r, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="month"
                        value={r.mes}
                        onChange={(e) => updateManualRow(idx, 'mes', e.target.value, 'receita')}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Valor (R$)"
                        value={r.valor || ''}
                        onChange={(e) => updateManualRow(idx, 'valor', e.target.value, 'receita')}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeManualRow(idx, 'receita')}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Despesas Manuais */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700">Despesas Adicionais</h4>
                  <button type="button" onClick={addManualDespesa} className="text-sm btn-secondary">
                    + Despesa
                  </button>
                </div>
                <div className="space-y-2">
                  {manualDespesas.map((d, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="month"
                        value={d.mes}
                        onChange={(e) => updateManualRow(idx, 'mes', e.target.value, 'despesa')}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <select
                        value={d.categoria}
                        onChange={(e) => updateManualRow(idx, 'categoria', e.target.value, 'despesa')}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        {categoriasDespesa.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Valor (R$)"
                        value={d.valor || ''}
                        onChange={(e) => updateManualRow(idx, 'valor', e.target.value, 'despesa')}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeManualRow(idx, 'despesa')}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (!excelFile && !showManual)}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processando...' : '🔄 Processar Dados'}
        </button>
        
        {!excelFile && !showManual && (
          <p className="mt-4 text-sm text-blue-600 text-center">
            💡 Selecione um arquivo Excel ou adicione dados manuais para processar.
          </p>
        )}
        
        {showManual && !excelFile && !manualReceitas.some(r => r.valor > 0) && !manualDespesas.some(d => d.valor > 0) && !Object.values(infoBasica).some(v => v && v.toString().trim() !== '') && (
          <p className="mt-4 text-sm text-blue-600 text-center">
            💡 Preencha pelo menos um campo de informações ou adicione receitas/despesas manuais.
          </p>
        )}
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Como usar:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Faça upload da planilha Excel com dados financeiros</li>
          <li>(Opcional) Adicione base histórica em CSV para fallback</li>
          <li>Clique em "Processar Dados"</li>
          <li>Explore os resultados no dashboard</li>
        </ul>
      </div>
    </div>
  )
}

