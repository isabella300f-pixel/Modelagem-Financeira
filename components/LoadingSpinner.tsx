'use client'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

