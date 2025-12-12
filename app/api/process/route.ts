import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { writeFile, unlink } from 'fs/promises'

const execAsync = promisify(exec)

// Configuração para Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  // Log para debug
  console.log('[API] POST /api/process - Iniciando processamento')
  console.log('[API] Request URL:', request.url)
  
  try {
    const contentType = request.headers.get('content-type')
    console.log('[API] Content-Type:', contentType)
    
    let excelFile: File | null = null
    let historicalFile: File | null = null
    let manualData: any = null
    let useBaseFile = false

    if (contentType?.includes('application/json')) {
      // Dados manuais ou requisição para usar arquivo base
      const body = await request.json()
      manualData = body.manualData
      useBaseFile = body.useBaseFile === true

      // Se pediu para usar arquivo base, não precisa de manualData
      if (useBaseFile) {
        manualData = null
      } else if (!manualData) {
        return NextResponse.json(
          { error: 'Dados manuais não fornecidos' },
          { status: 400 }
        )
      }
    } else {
      // Upload de arquivo
      const formData = await request.formData()
      excelFile = formData.get('excel') as File | null
      historicalFile = formData.get('historical') as File | null
      
      // Verificar se há dados manuais no FormData
      const manualDataStr = formData.get('manualData') as string | null
      if (manualDataStr) {
        try {
          manualData = JSON.parse(manualDataStr)
        } catch (e) {
          console.error('Erro ao parsear dados manuais:', e)
        }
      }
    }

    // Criar diretório temporário
    const tempDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    let excelPath: string | null = null
    let historicalPath: string | null = null
    let manualDataPath: string | null = null
    let fileType = 'excel'

    // Salvar arquivo Excel se fornecido ou usar arquivo base
    if (excelFile) {
      excelPath = path.join(tempDir, `excel_${Date.now()}.xlsx`)
      const excelBuffer = Buffer.from(await excelFile.arrayBuffer())
      await writeFile(excelPath, excelBuffer)
    } else if (useBaseFile) {
      // Usar planilha base do projeto
      const baseFilePath = path.join(process.cwd(), 'data', 'resultados', 
        'MODELAGEM_FINANCEIRA - LIMPEZACA HOME OFFICE V01.1 - Lages SC - Franqueado (1).xlsx')
      
      if (fs.existsSync(baseFilePath)) {
        excelPath = baseFilePath
        console.log('[API] Usando planilha base:', baseFilePath)
      } else {
        return NextResponse.json(
          { error: 'Planilha base não encontrada no servidor' },
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Salvar arquivo histórico se fornecido
    if (historicalFile) {
      historicalPath = path.join(tempDir, `historical_${Date.now()}.csv`)
      const historicalBuffer = Buffer.from(await historicalFile.arrayBuffer())
      await writeFile(historicalPath, historicalBuffer)
    }

    // Criar arquivo CSV com dados manuais se fornecido
    // manualData pode ter: info_basica, receitas, despesas
    if (manualData && (manualData.receitas?.length > 0 || manualData.despesas?.length > 0 || manualData.info_basica)) {
      const csvLines = ['data,categoria,descricao,valor,tipo,fonte,info_basica']
      
      // Preparar info_basica como JSON string
      const infoBasicaStr = manualData.info_basica ? JSON.stringify(manualData.info_basica) : ''
      
      // Adicionar receitas
      if (manualData.receitas && manualData.receitas.length > 0) {
        manualData.receitas.forEach((r: any) => {
          csvLines.push(`${r.data},${r.categoria},${r.tipo_servico || 'Receita'},${r.valor},${r.tipo},${r.fonte},${infoBasicaStr}`)
        })
      }
      
      // Adicionar despesas
      if (manualData.despesas && manualData.despesas.length > 0) {
        manualData.despesas.forEach((d: any) => {
          csvLines.push(`${d.data},${d.categoria},${d.subcategoria || d.categoria},${d.valor},${d.tipo},${d.fonte},${infoBasicaStr}`)
        })
      }
      
      // Se só tem info_basica sem receitas/despesas, criar linha vazia
      if (manualData.info_basica && (!manualData.receitas || manualData.receitas.length === 0) && (!manualData.despesas || manualData.despesas.length === 0)) {
        csvLines.push(`,,,0,,,${infoBasicaStr}`)
      }
      
      manualDataPath = path.join(tempDir, `manual_${Date.now()}.csv`)
      await writeFile(manualDataPath, csvLines.join('\n'), 'utf-8')
    }

    // Validar que há pelo menos um tipo de dado
    if (!excelPath && !manualDataPath) {
      return NextResponse.json(
        { error: 'Nenhum dado fornecido. Forneça um arquivo Excel ou dados manuais.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Determinar tipo de processamento
    if (!excelPath && manualDataPath) {
      fileType = 'manual'
      excelPath = manualDataPath // Para compatibilidade com o script
    } else if (excelPath && manualDataPath) {
      fileType = 'mixed' // Novo tipo: combinado
    }

    // Executar script Python
    // No Vercel, usar python3, localmente pode ser python
    const pythonCmd = process.env.VERCEL ? 'python3' : 'python'
    const scriptPath = path.join(process.cwd(), 'scripts', 'processar_api.py')
    
    // Garantir que o caminho está correto
    const fullPythonCmd = `${pythonCmd} "${scriptPath}" "${excelPath || 'None'}" ${historicalPath ? `"${historicalPath}"` : 'None'} "${fileType}" "${manualDataPath || 'None'}"`

    console.log('[API] Executando Python:', fullPythonCmd.substring(0, 100) + '...')

    const { stdout, stderr } = await execAsync(fullPythonCmd, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
      },
    })

    if (stderr && !stderr.includes('Warning') && !stderr.includes('Deprecation')) {
      console.error('[API] Python stderr:', stderr.substring(0, 500))
    }
    
    console.log('[API] Python stdout length:', stdout.length)

    // Ler resultado JSON
    const resultPath = path.join(tempDir, 'resultado.json')
    let resultado
    if (fs.existsSync(resultPath)) {
      const resultData = fs.readFileSync(resultPath, 'utf-8')
      resultado = JSON.parse(resultData)
      // Limpar arquivo de resultado
      await unlink(resultPath)
    } else {
      // Tentar parsear stdout como JSON
      try {
        // Limpar stdout (remover warnings e outros textos)
        const cleanStdout = stdout.trim().split('\n').filter(line => {
          return line.trim().startsWith('{') || line.trim().startsWith('[')
        }).join('\n')
        
        if (cleanStdout) {
          resultado = JSON.parse(cleanStdout)
        } else {
          throw new Error('Nenhum JSON válido encontrado no output')
        }
      } catch (parseError: any) {
        console.error('Erro ao parsear JSON:', parseError)
        console.error('Stdout:', stdout)
        console.error('Stderr:', stderr)
        throw new Error(`Erro ao processar resultado: ${parseError.message}`)
      }
    }

    // Limpar arquivos temporários
    try {
      if (excelPath) await unlink(excelPath)
      if (historicalPath) await unlink(historicalPath)
      if (manualDataPath) await unlink(manualDataPath)
    } catch (e) {
      console.warn('Erro ao limpar arquivos temporários:', e)
    }

    return NextResponse.json(resultado, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Erro no processamento:', error)
    return NextResponse.json(
      {
        error: error.message || 'Erro ao processar dados',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Retornar método não permitido para GET
export async function GET(request: NextRequest) {
  console.log('[API] GET /api/process - Método não permitido')
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

