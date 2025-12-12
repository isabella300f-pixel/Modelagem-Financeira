'use client'

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div className="card text-center">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3d6ba0] mb-4"></div>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  )
}

