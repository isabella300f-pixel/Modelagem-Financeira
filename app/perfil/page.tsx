'use client'

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">👤 Meu Perfil</h1>

        {/* Dados Cadastrais */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Dados Cadastrais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
              <input 
                type="text" 
                defaultValue="João da Silva" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CPF</label>
              <input 
                type="text" 
                defaultValue="123.456.789-00" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
              <input 
                type="email" 
                defaultValue="joao@exemplo.com" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
              <input 
                type="tel" 
                defaultValue="(48) 99999-9999" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
          </div>
        </div>

        {/* Informações da Unidade */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Informações da Unidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Unidade</label>
              <input 
                type="text" 
                defaultValue="Lages SC - Centro" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CNPJ</label>
              <input 
                type="text" 
                defaultValue="12.345.678/0001-90" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
              <input 
                type="text" 
                defaultValue="Rua Exemplo, 123 - Centro, Lages - SC, 88501-000" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 inline-block">
                ✓ Ativa
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Responsável</label>
              <input 
                type="text" 
                defaultValue="João da Silva" 
                className="w-full px-4 py-2 rounded-lg border border-[#2d3a4f] bg-[#1a2332] text-white"
              />
            </div>
          </div>
        </div>

        {/* Indicadores Principais */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Indicadores Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="text-sm text-gray-400 mb-1">Faturamento Mensal</div>
              <div className="text-2xl font-bold text-white">R$ 125.000</div>
              <div className="text-xs text-green-400 mt-1">↑ +15% vs mês anterior</div>
            </div>
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="text-sm text-gray-400 mb-1">Evolução Mensal</div>
              <div className="text-2xl font-bold text-white">+18.5%</div>
              <div className="text-xs text-green-400 mt-1">Crescimento constante</div>
            </div>
            <div className="p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="text-sm text-gray-400 mb-1">Nível de Desempenho</div>
              <div className="text-2xl font-bold text-green-400">Excelente</div>
              <div className="text-xs text-gray-400 mt-1">NPS: 8.2</div>
            </div>
          </div>
        </div>

        {/* Histórico de Interações */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Histórico de Interações</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400">📅</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">Reunião com Consultor</div>
                <div className="text-sm text-gray-400">05/02/2024 - 14:00</div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                Concluída
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#1e2a3a] rounded-lg border border-[#2d3a4f]">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400">📊</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">Envio de DRE - Janeiro</div>
                <div className="text-sm text-gray-400">01/02/2024</div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                Concluída
              </span>
            </div>
          </div>
        </div>

        <button className="btn-primary">
          Salvar Alterações
        </button>
      </div>
    </div>
  )
}

