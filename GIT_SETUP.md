# 🚀 Guia para Subir no Git

## Checklist Pré-Commit

- [x] Arquivos temporários removidos
- [x] `.gitignore` configurado
- [x] `.gitattributes` criado
- [x] `README.md` atualizado
- [x] Scripts de teste removidos
- [x] Estrutura organizada

## Comandos para Primeiro Commit

```bash
# 1. Inicializar repositório (se ainda não foi feito)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "feat: Sistema de Análise Financeira - DRE com Fallback Histórico

- Sistema web completo Next.js + Python
- Extração automática de planilhas Excel
- Geração de DRE mensal/trimestral/anual
- Cálculo de KPIs (Margem Bruta, EBITDA, Margem Líquida)
- Dashboard interativo com gráficos
- Entrada manual de dados
- Exportação de resultados
- Deploy configurado para Vercel"

# 4. Adicionar remote (substitua pela URL do seu repositório)
git remote add origin <URL_DO_SEU_REPOSITORIO>

# 5. Fazer push
git branch -M main
git push -u origin main
```

## Comandos para Commits Futuros

```bash
# Ver status
git status

# Adicionar arquivos específicos
git add <arquivo>

# Ou adicionar todos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main
```

## Estrutura que será versionada

```
✅ Sera versionado:
- src/                    # Código fonte
- scripts/                # Scripts Python (exceto testes)
- config/                 # Configurações
- docs/                   # Documentação
- package.json
- requirements.txt
- next.config.js
- vercel.json
- tsconfig.json
- README.md
- .gitignore
- .gitattributes

❌ NÃO será versionado:
- node_modules/
- .next/
- __pycache__/
- data/resultados/
- *.xlsx (exceto exemplos)
- app/ (pasta duplicada)
- components/ (pasta duplicada)
- scripts/teste_*.py
- scripts/testar_*.py
```

## Boas Práticas

1. **Sempre verifique o que será commitado:**
   ```bash
   git status
   git diff
   ```

2. **Commits descritivos:**
   - Use prefixos: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
   - Seja específico sobre o que mudou

3. **Não commitar:**
   - Arquivos com dados sensíveis
   - Arquivos temporários
   - Dependências (node_modules, venv)
   - Arquivos de build (.next, dist)

4. **Branching (opcional):**
   ```bash
   # Criar branch para feature
   git checkout -b feature/nova-funcionalidade
   
   # Fazer commits na branch
   git commit -m "feat: nova funcionalidade"
   
   # Voltar para main e fazer merge
   git checkout main
   git merge feature/nova-funcionalidade
   ```

## Troubleshooting

### Arquivos grandes
Se tentar commitar arquivos grandes (>100MB), o Git pode rejeitar. Use `.gitignore` para excluí-los.

### Conflitos
Se houver conflitos no merge:
```bash
git pull origin main
# Resolver conflitos manualmente
git add .
git commit -m "fix: resolve conflicts"
git push
```

## Deploy Automático

Se conectar o repositório ao Vercel, o deploy será automático a cada push para `main`.

