'use client'

import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

interface ExportButtonsProps {
  data: any
}

export default function ExportButtons({ data }: ExportButtonsProps) {
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()

    // DRE Mensal
    if (data.dre_mensal && data.dre_mensal.length > 0) {
      const ws1 = XLSX.utils.json_to_sheet(data.dre_mensal)
      XLSX.utils.book_append_sheet(wb, ws1, 'DRE_Mensal')
    }

    // DRE Trimestral
    if (data.dre_trimestral && data.dre_trimestral.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(data.dre_trimestral)
      XLSX.utils.book_append_sheet(wb, ws2, 'DRE_Trimestral')
    }

    // DRE Anual
    if (data.dre_anual && data.dre_anual.length > 0) {
      const ws3 = XLSX.utils.json_to_sheet(data.dre_anual)
      XLSX.utils.book_append_sheet(wb, ws3, 'DRE_Anual')
    }

    // KPIs
    if (data.kpis && data.kpis.length > 0) {
      const ws4 = XLSX.utils.json_to_sheet(data.kpis)
      XLSX.utils.book_append_sheet(wb, ws4, 'KPIs')
    }

    // Flags
    if (data.flags && data.flags.length > 0) {
      const ws5 = XLSX.utils.json_to_sheet(data.flags)
      XLSX.utils.book_append_sheet(wb, ws5, 'Flags_Coverage')
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'resultados_analise_financeira.xlsx')
  }

  const exportToJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    saveAs(blob, 'resultados_analise_financeira.json')
  }

  const exportReport = () => {
    let report = '='.repeat(80) + '\n'
    report += 'RELATÓRIO DE ANÁLISE FINANCEIRA\n'
    report += '='.repeat(80) + '\n\n'
    report += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n\n`
    report += '-'.repeat(80) + '\n'
    report += 'RESUMO DE DADOS\n'
    report += '-'.repeat(80) + '\n'
    report += `Registros processados: ${data.total_records || 'N/A'}\n`
    report += `Meses com dados: ${data.total_months || 'N/A'}\n\n`

    if (data.flags && data.flags.length > 0) {
      report += '-'.repeat(80) + '\n'
      report += 'STATUS DE COVERAGE POR CATEGORIA\n'
      report += '-'.repeat(80) + '\n'
      data.flags.forEach((flag: any) => {
        report += `${flag.categoria || flag.category}: ${flag.status} (${((flag.coverage_pct || flag.coverage || 0) * 100).toFixed(1)}%)\n`
      })
      report += '\n'
    }

    if (data.dre_anual && data.dre_anual.length > 0) {
      report += '-'.repeat(80) + '\n'
      report += 'DRE ANUAL - RESUMO\n'
      report += '-'.repeat(80) + '\n'
      data.dre_anual.forEach((ano: any) => {
        report += `\nAno: ${ano.ano || ano.periodo}\n`
        report += `  Receita Líquida: R$ ${(ano.receita_liquida || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
        report += `  EBITDA: R$ ${(ano.ebitda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
        report += `  Resultado Líquido: R$ ${(ano.resultado_liquido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
      })
    }

    report += '\n' + '='.repeat(80) + '\n'

    const blob = new Blob([report], { type: 'text/plain' })
    saveAs(blob, 'relatorio_analise.txt')
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-white">Exportar Resultados</h3>
      <p className="text-gray-300 mb-6">
        Baixe os resultados da análise em diferentes formatos
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={exportToExcel} className="btn-primary flex items-center justify-center">
          <span className="mr-2">📊</span>
          Exportar Excel
        </button>

        <button onClick={exportToJSON} className="btn-secondary flex items-center justify-center">
          <span className="mr-2">📄</span>
          Exportar JSON
        </button>

        <button onClick={exportReport} className="btn-secondary flex items-center justify-center">
          <span className="mr-2">📝</span>
          Relatório Texto
        </button>
      </div>

      <div className="mt-6 p-4 bg-[#1e3a5f]/20 rounded-lg border border-[#3d6ba0]/30">
        <h4 className="font-semibold text-blue-200 mb-2">Formato dos Exports:</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li><strong>Excel:</strong> Arquivo .xlsx com múltiplas abas (DRE, KPIs, Flags)</li>
          <li><strong>JSON:</strong> Dados completos em formato JSON para integração</li>
          <li><strong>Relatório:</strong> Resumo executivo em texto (.txt)</li>
        </ul>
      </div>
    </div>
  )
}
