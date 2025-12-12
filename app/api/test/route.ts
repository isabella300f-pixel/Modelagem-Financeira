import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'Test route working', timestamp: new Date().toISOString() },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Test route - GET method', timestamp: new Date().toISOString() },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

