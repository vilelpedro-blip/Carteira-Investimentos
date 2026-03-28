#!/bin/bash
# 🚀 Deploy alternativo para carteira

echo "🌐 DEPLOY ALTERNATIVO"
echo "===================="

IP_PUBLIC="76.13.61.195"
PORT="9000"

echo "1. Iniciando servidor HTTP no container root..."
docker exec -d openclaw-root bash -c "cd /data/.openclaw/workspace && python3 -m http.server $PORT"

echo "2. URLs disponíveis:"
echo "   • Carteira completa: http://$IP_PUBLIC:$PORT/carteira-final.html"
echo "   • Teste simplificado: http://$IP_PUBLIC:$PORT/teste-real.html"
echo "   • Lista de arquivos: http://$IP_PUBLIC:$PORT/"

echo "3. Para acessar no iPhone:"
echo "   • Conecte-se à mesma rede da VPS"
echo "   • Abra: http://$IP_PUBLIC:$PORT/teste-real.html"
echo "   • Ou use QR code (se gerado)"

echo ""
echo "⚠️  NOTA: Se não funcionar externamente:"
echo "   • Verificar firewall da VPS"
echo "   • Porta $PORT precisa estar aberta"
echo "   • Ou usar tunnel (ngrok/cloudflare)"
