#!/bin/bash
# 🌐 Tunnel Cloudflare para acesso externo

echo "🚇 CONFIGURANDO TUNNEL CLOUDFLARE"
echo "================================="

# Parar servidores anteriores
pkill -f "http.server" 2>/dev/null
pkill -f "cloudflared" 2>/dev/null

echo "1. Iniciando servidor HTTP local..."
cd /data/.openclaw/workspace
python3 -m http.server 8080 > /tmp/http-local.log 2>&1 &
echo "✅ Servidor local: http://localhost:8080"

echo "2. Iniciando tunnel Cloudflare..."
echo "⚠️  NOTA: Primeira execução pedirá login no Cloudflare"
echo "   • Abra o link que aparecer"
echo "   • Faça login na sua conta Cloudflare"
echo "   • Autorize o tunnel"
echo ""
echo "Executando tunnel (pode pedir login)..."
/tmp/cloudflared tunnel --url http://localhost:8080 2>&1 | head -20

echo ""
echo "3. Alternativa: Ngrok (mais simples)..."
echo "   • Acesse: https://ngrok.com"
echo "   • Crie conta gratuita"
echo "   • Baixe token"
echo "   • Execute: ngrok http 8080"
echo ""
echo "4. URLs para teste local:"
echo "   • Carteira: http://localhost:8080/carteira-final.html"
echo "   • Teste: http://localhost:8080/teste-real.html"
