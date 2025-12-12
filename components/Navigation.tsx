'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  badge?: number
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' },
  { id: 'perfil', label: 'Meu Perfil', icon: '👤', path: '/perfil' },
  { id: 'documentos', label: 'Documentos', icon: '📁', path: '/documentos', badge: 2 },
  { id: 'planilhas', label: 'Planilhas', icon: '📊', path: '/planilhas' },
  { id: 'treinamentos', label: 'Treinamentos', icon: '📚', path: '/treinamentos' },
  { id: 'comunicacao', label: 'Comunicação', icon: '💬', path: '/comunicacao', badge: 3 },
  { id: 'operacional', label: 'Gestão Operacional', icon: '📝', path: '/operacional' },
  { id: 'painel', label: 'Painel Gerencial', icon: '📈', path: '/painel-gerencial' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Renderizar sempre a mesma estrutura HTML, apenas mudar a classe CSS após mount
  // Isso evita problemas de hidratação
  return (
    <div className="w-64 bg-[#1a2332] border-r border-[#2d3a4f] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2d3a4f]">
        <Logo />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          // Só verificar pathname após o mount para evitar diferença de hidratação
          const isActive = mounted && pathname === item.path
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative ${
                isActive
                  ? 'bg-[#1e3a5f] text-white border border-[#3d6ba0]'
                  : 'text-gray-300 hover:bg-[#2d3a4f] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[#2d3a4f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">João da Silva</p>
            <p className="text-xs text-gray-400 truncate">Franqueado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

