# 📋 Plano de Implementação - Funcionalidades Pendentes

## 🎯 Status Atual
✅ Estrutura base criada (layout, navegação, páginas)
✅ Design system (tema escuro 300F)
✅ Páginas estáticas criadas

## 🔨 Funcionalidades a Implementar

### 1. Autenticação e Autorização
- [ ] Sistema de login (email + senha 4 dígitos)
- [ ] Gerenciamento de sessão
- [ ] Controle de acesso por perfil (Franqueado, Consultor, Admin)
- [ ] Recuperação de senha
- [ ] Middleware de autenticação

### 2. Backend/API
- [ ] API REST para todas as entidades
- [ ] Banco de dados (PostgreSQL/SQLite)
- [ ] Models (Franqueado, Documento, Treinamento, etc.)
- [ ] Upload de arquivos (S3 ou storage local)
- [ ] Validações e sanitização

### 3. Perfil do Franqueado
- [ ] CRUD completo de dados cadastrais
- [ ] Upload de foto de perfil
- [ ] Histórico de interações (logs)
- [ ] Atualização de status da unidade
- [ ] Integração com indicadores reais

### 4. Documentos
- [ ] Upload real de arquivos
- [ ] Armazenamento e organização
- [ ] Sistema de versões
- [ ] Alertas de vencimento (cron jobs)
- [ ] Assinatura digital real
- [ ] Download de documentos
- [ ] Validação de tipos de arquivo
- [ ] Preview de documentos

### 5. Planilhas (Parcialmente implementado)
- [x] Upload e processamento Excel
- [x] Geração de DRE/KPIs
- [ ] Histórico de envios no banco
- [ ] Notificações de prazos
- [ ] Validação de formato
- [ ] Comparativo entre períodos
- [ ] Exportação de relatórios

### 6. Treinamentos
- [ ] Upload de vídeos e PDFs
- [ ] Player de vídeo integrado
- [ ] Sistema de progresso (salvar no banco)
- [ ] Quiz interativo
- [ ] Certificados de conclusão
- [ ] Notificações de novos treinamentos
- [ ] Trilhas personalizadas por perfil

### 7. Comunicação
- [ ] Sistema de chat em tempo real (WebSocket)
- [ ] Criação e gestão de chamados/tickets
- [ ] Notificações push
- [ ] Sistema de mensagens
- [ ] Histórico de conversas
- [ ] Agendamento de reuniões (integração calendário)
- [ ] Email notifications

### 8. Gestão Operacional
- [ ] CRUD de checklists
- [ ] Upload de fotos/evidências
- [ ] Geração automática de relatórios
- [ ] Sistema de pendências
- [ ] Notificações de tarefas
- [ ] Workflow de aprovação

### 9. Painel Gerencial
- [ ] Dashboard com dados reais
- [ ] Gráficos interativos (Chart.js/Recharts)
- [ ] Filtros e busca
- [ ] Exportação de relatórios
- [ ] Comparativos dinâmicos
- [ ] Alertas automáticos
- [ ] Relatórios customizáveis

### 10. Notificações
- [ ] Sistema centralizado de notificações
- [ ] Badges no menu
- [ ] Toast notifications
- [ ] Email notifications
- [ ] Push notifications (opcional)

### 11. Busca e Filtros
- [ ] Busca global
- [ ] Filtros avançados
- [ ] Ordenação de listas
- [ ] Paginação

### 12. Relatórios e Exportações
- [ ] Geração de PDFs
- [ ] Exportação Excel
- [ ] Templates de relatórios
- [ ] Agendamento de relatórios

## 🗄️ Banco de Dados (Estrutura Sugerida)

### Tabelas Principais
- `users` - Usuários do sistema
- `franqueados` - Dados dos franqueados
- `documentos` - Documentos
- `treinamentos` - Treinamentos e trilhas
- `progresso_treinamento` - Progresso dos usuários
- `comunicados` - Comunicados da rede
- `chamados` - Tickets de suporte
- `mensagens` - Mensagens do chat
- `checklists` - Checklists operacionais
- `planilhas` - Histórico de envios de planilhas
- `tarefas` - Tarefas e pendências
- `notificacoes` - Notificações do sistema

## 🔧 Tecnologias Recomendadas

### Backend
- **Next.js API Routes** (já implementado parcialmente)
- **Prisma ORM** (recomendado para TypeScript)
- **PostgreSQL** (produção) ou **SQLite** (desenvolvimento)
- **NextAuth.js** (autenticação)
- **Zod** (validação)
- **Multer/Formidable** (upload de arquivos)

### Real-time
- **Socket.io** ou **Pusher** (chat)
- **Server-Sent Events** (notificações)

### Storage
- **AWS S3** ou **Vercel Blob** (arquivos)
- **Cloudinary** (imagens e vídeos)

## 📝 Priorização Sugerida

### Fase 1 - Essencial (2-3 semanas)
1. Autenticação e Autorização
2. Backend básico (API + Banco de Dados)
3. CRUD de Perfil
4. Upload de Documentos básico

### Fase 2 - Core Features (3-4 semanas)
5. Sistema de Planilhas completo
6. Treinamentos básicos (vídeos + progresso)
7. Comunicação básica (chat simples)
8. Checklists operacionais

### Fase 3 - Avançado (2-3 semanas)
9. Painel Gerencial completo
10. Notificações e alertas
11. Relatórios e exportações
12. Busca e filtros

## 🚀 Próximos Passos Imediatos

1. **Escolher stack de backend** (Prisma + PostgreSQL recomendado)
2. **Criar estrutura de banco de dados**
3. **Implementar autenticação**
4. **Criar API base para CRUD**

Qual funcionalidade você gostaria de implementar primeiro?

