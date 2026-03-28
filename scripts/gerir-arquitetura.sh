#!/bin/bash
# 🏗️ Script de gestão da arquitetura OpenClaw V2

set -e

echo "🦞 GESTOR DE ARQUITETURA OPENCLAW V2"
echo "====================================="

case "$1" in
    status)
        echo "📊 STATUS DA ARQUITETURA:"
        echo ""
        echo "🐳 CONTAINERS:"
        docker ps --filter "name=openclaw" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "🌐 SERVIÇOS:"
        echo "  • HTTP Server (porta 9000): $(timeout 1 bash -c 'echo > /dev/tcp/localhost/9000' 2>/dev/null && echo '✅ Ativo' || echo '❌ Inativo')"
        echo "  • OpenClaw Gateway (45154): $(timeout 1 bash -c 'echo > /dev/tcp/localhost/45154' 2>/dev/null && echo '✅ Ativo' || echo '❌ Inativo')"
        echo "  • OpenClaw Gateway (18789): $(timeout 1 bash -c 'echo > /dev/tcp/localhost/18789' 2>/dev/null && echo '✅ Ativo' || echo '❌ Inativo')"
        echo ""
        echo "📁 WORKSPACE: /data/.openclaw"
        echo "  • Carteira: http://localhost:9000/carteira-final.html"
        ;;
    
    restart)
        echo "🔄 REINICIANDO ARQUITETURA..."
        docker restart openclaw-old openclaw-root
        echo "✅ Containers reiniciados"
        ;;
    
    logs)
        echo "📋 LOGS:"
        echo "1. openclaw-old (produção):"
        docker logs openclaw-old --tail 10 2>/dev/null || echo "  Sem logs disponíveis"
        echo ""
        echo "2. openclaw-root (devops):"
        docker logs openclaw-root --tail 10 2>/dev/null || echo "  Sem logs disponíveis"
        ;;
    
    deploy)
        echo "🚀 FAZENDO DEPLOY DA CARTEIRA..."
        cd /data/.openclaw/workspace
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "Instalando Vercel CLI..."
            npm install -g vercel
            vercel --prod
        fi
        ;;
    
    http-start)
        echo "🌐 INICIANDO SERVIDOR HTTP..."
        cd /data/.openclaw/workspace
        python3 -m http.server 9000 &
        echo "✅ Servidor HTTP iniciado na porta 9000"
        echo "   URL: http://localhost:9000/carteira-final.html"
        ;;
    
    http-stop)
        echo "🛑 PARANDO SERVIDOR HTTP..."
        pkill -f "http.server 9000" 2>/dev/null && echo "✅ Servidor parado" || echo "⚠️  Servidor não estava em execução"
        ;;
    
    backup)
        echo "💾 FAZENDO BACKUP DO WORKSPACE..."
        BACKUP_DIR="/data/.openclaw-backup/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r /data/.openclaw/workspace/* "$BACKUP_DIR/" 2>/dev/null || true
        echo "✅ Backup criado em: $BACKUP_DIR"
        echo "   $(ls -la "$BACKUP_DIR" | wc -l) arquivos copiados"
        ;;
    
    help|*)
        echo "📚 AJUDA:"
        echo "  ./gerir-arquitetura.sh [comando]"
        echo ""
        echo "📋 COMANDOS DISPONÍVEIS:"
        echo "  status     - Mostra status da arquitetura"
        echo "  restart    - Reinicia todos os containers"
        echo "  logs       - Mostra logs dos containers"
        echo "  deploy     - Faz deploy da carteira para Vercel"
        echo "  http-start - Inicia servidor HTTP na porta 9000"
        echo "  http-stop  - Para servidor HTTP"
        echo "  backup     - Faz backup do workspace"
        echo "  help       - Mostra esta ajuda"
        ;;
esac

echo ""
echo "🏗️ Arquitetura V2: /data/.openclaw/workspace/ARQUITETURA-V2.md"