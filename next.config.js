/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configurar para usar src/web como base
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Permitir upload de arquivos grandes
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

