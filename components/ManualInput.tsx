'use client'

import { useState } from 'react'

interface ManualInputProps {
  onProcess: (data: any) => void
  loading: boolean
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

// Cidades por estado (exemplo simplificado - pode expandir)
const CIDADE_POR_ESTADO: Record<string, string[]> = {
  'Santa Catarina (SC)': ['Lages', 'Florianópolis', 'Blumenau', 'Joinville', 'Chapecó', 'Criciúma'],
  'São Paulo (SP)': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
  'Minas Gerais (MG)': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
  // Adicionar mais conforme necessário
}

type Receita = {
  mes: string
  valor: string
}

type Despesa = {
  mes: string
  categoria: string
  valor: string
  descricao?: string
}

type FormDataState = {
  receitas: Receita[]
  despesas: Despesa[]
}

export default function ManualInput({ onProcess, loading }: ManualInputProps) {
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

  const [formData, setFormData] = useState<FormDataState>({
    receitas: [{ mes: '2024-01', valor: '' }],
    despesas: [{ mes: '2024-01', categoria: 'Pessoal', valor: '', descricao: '' }],
  })

  const updateInfoBasica = (field: string, value: string) => {
    setInfoBasica({ ...infoBasica, [field]: value })
    // Se mudou o estado, resetar cidade
    if (field === 'estado') {
      setInfoBasica(prev => ({ ...prev, estado: value, cidade: '' }))
    }
  }

  const addReceita = () => {
    setFormData({
      ...formData,
      receitas: [...formData.receitas, { mes: '2024-01', valor: '' }]
    })
  }

  const addDespesa = () => {
    setFormData({
      ...formData,
      despesas: [
        ...formData.despesas,
        { mes: '2024-01', categoria: 'Pessoal', valor: '', descricao: '' }
      ]
    })
  }

  const updateReceita = (index: number, field: keyof Receita, value: any) => {
    const newReceitas = [...formData.receitas]
    newReceitas[index] = { ...newReceitas[index], [field]: value }
    setFormData({ ...formData, receitas: newReceitas })
  }

  const updateDespesa = (index: number, field: keyof Despesa, value: any) => {
    const newDespesas = [...formData.despesas]
    newDespesas[index] = { ...newDespesas[index], [field]: value }
    setFormData({ ...formData, despesas: newDespesas })
  }

  const removeReceita = (index: number) => {
    if (formData.receitas.length > 1) {
      setFormData({
        ...formData,
        receitas: formData.receitas.filter((_, i) => i !== index)
      })
    }
  }

  const removeDespesa = (index: number) => {
    if (formData.despesas.length > 1) {
      setFormData({
        ...formData,
        despesas: formData.despesas.filter((_, i) => i !== index)
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Converter para formato esperado pela API
    const dados = {
      info_basica: infoBasica, // Enviar informações básicas
      receitas: formData.receitas
        .filter(r => r.valor && parseFloat(r.valor.toString()) > 0)
        .map(r => ({
          data: `${r.mes}-01`,
          categoria: 'Receita',
          tipo_servico: 'Entrada Manual',
          valor: parseFloat(r.valor.toString()) || 0,
          tipo: 'entrada',
          fonte: 'Manual'
        })),
      despesas: formData.despesas
        .filter(d => d.valor && parseFloat(d.valor.toString()) > 0)
        .map(d => ({
          data: `${d.mes}-01`,
          categoria: d.categoria,
          subcategoria: d.descricao ?? d.categoria,
          valor: parseFloat(d.valor.toString()) || 0,
          tipo: 'saida',
          fonte: 'Manual'
        }))
    }

    onProcess(dados)
  }

  const categoriasDespesa = [
    'Pessoal',
    'Aluguel',
    'Utilidades',
    'Telecomunicações',
    'Marketing',
    'Administrativo',
    'Manutenção',
    'Insumos',
    'Outras Despesas'
  ]

  const cidadesDisponiveis = infoBasica.estado
    ? (CIDADE_POR_ESTADO[infoBasica.estado] || [])
    : []

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-white mb-6">
        Entrada Manual de Dados
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div>
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Informações do Negócio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nome do Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome do Cliente
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={infoBasica.nome_cliente}
                onChange={(e) => updateInfoBasica('nome_cliente', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
              />
            </div>

            {/* Nome do Estabelecimento */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome do Estabelecimento
              </label>
              <input
                type="text"
                placeholder="Ex: Bar do João"
                value={infoBasica.nome_estabelecimento}
                onChange={(e) => updateInfoBasica('nome_estabelecimento', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
              />
            </div>

            {/* Tipo de Negócio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de negócio
              </label>
              <select
                value={infoBasica.tipo_negocio}
                onChange={(e) => updateInfoBasica('tipo_negocio', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white"
              >
                <option value="">Selecione...</option>
                {TIPOS_NEGOCIO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={infoBasica.estado}
                onChange={(e) => updateInfoBasica('estado', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white"
              >
                <option value="">Selecione...</option>
                {ESTADOS.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cidade
              </label>
              <select
                value={infoBasica.cidade}
                onChange={(e) => updateInfoBasica('cidade', e.target.value)}
                disabled={!infoBasica.estado}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white disabled:bg-[#1a1f2a] disabled:cursor-not-allowed"
              >
                <option value="">Selecione...</option>
                {cidadesDisponiveis.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            {/* Capital Investido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Capital investido (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 8000"
                value={infoBasica.capital_investido}
                onChange={(e) => updateInfoBasica('capital_investido', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
              />
            </div>

            {/* Ticket Médio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ticket médio por cliente (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 120"
                value={infoBasica.ticket_medio}
                onChange={(e) => updateInfoBasica('ticket_medio', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
              />
            </div>

            {/* Capacidade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Capacidade / clientes por mês (opcional)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 1200"
                value={infoBasica.capacidade}
                onChange={(e) => updateInfoBasica('capacidade', e.target.value)}
                className="w-full px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
              />
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            💡 <strong>Dica:</strong> Campos não preenchidos serão buscados automaticamente da planilha base.
          </p>
        </div>

        {/* Receitas Adicionais */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-300">Receitas Adicionais</h3>
            <button
              type="button"
              onClick={addReceita}
              className="px-4 py-2 bg-[#1e3a5f] text-white border border-[#3d6ba0] rounded-lg hover:bg-gray-300 text-sm"
            >
              + Receita
            </button>
          </div>

          <div className="space-y-3">
            {formData.receitas.map((receita, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <input
                  type="month"
                  value={receita.mes}
                  onChange={(e) => updateReceita(index, 'mes', e.target.value)}
                  className="px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={receita.valor || ''}
                  onChange={(e) => updateReceita(index, 'valor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => removeReceita(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.receitas.length === 1}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Despesas Adicionais */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-300">Despesas Adicionais</h3>
            <button
              type="button"
              onClick={addDespesa}
              className="px-4 py-2 bg-[#1e3a5f] text-white border border-[#3d6ba0] rounded-lg hover:bg-gray-300 text-sm"
            >
              + Despesa
            </button>
          </div>

          <div className="space-y-3">
            {formData.despesas.map((despesa, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
                <input
                  type="month"
                  value={despesa.mes}
                  onChange={(e) => updateDespesa(index, 'mes', e.target.value)}
                  className="px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white"
                />
                <select
                  value={despesa.categoria}
                  onChange={(e) => updateDespesa(index, 'categoria', e.target.value)}
                  className="px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white"
                >
                  {categoriasDespesa.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Descrição (opcional)"
                  value={despesa.descricao || ''}
                  onChange={(e) => updateDespesa(index, 'descricao', e.target.value)}
                  className="px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={despesa.valor || ''}
                  onChange={(e) => updateDespesa(index, 'valor', e.target.value)}
                  className="px-3 py-2 border border-[#2d3a4f] rounded-lg bg-[#1a2332] text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => removeDespesa(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.despesas.length === 1}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processando...' : '🔄 Processar Dados'}
        </button>
      </form>
    </div>
  )
}
