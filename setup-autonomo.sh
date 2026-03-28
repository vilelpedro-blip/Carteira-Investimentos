#!/bin/bash
# Script para configurar container autónomo
# Executar dentro do novo container

echo "=== CONFIGURAÇÃO CONTAINER AUTÓNOMO ==="
echo ""

# 1. Atualizar e instalar ferramentas básicas
echo "1. Instalando ferramentas básicas..."
apt-get update && apt-get install -y \
  curl wget git vim nano htop \
  python3-pip nodejs npm \
  net-tools iproute2 2>/dev/null || echo "Algumas instalações falharam (OK)"

# 2. Configurar segurança OpenClaw
echo ""
echo "2. Configurando segurança OpenClaw..."
openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth false
openclaw config set gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback false
openclaw config set gateway.controlUi.allowInsecureAuth false

# 3. Reiniciar gateway para aplicar segurança
echo ""
echo "3. Reiniciando gateway OpenClaw..."
openclaw gateway restart 2>/dev/null || echo "Gateway restart falhou (pode precisar de tempo)"

# 4. Iniciar servidor HTTP
echo ""
echo "4. Iniciando servidor HTTP..."
pkill -f "http.server 8000" 2>/dev/null || true
nohup python3 -m http.server 8000 --directory /data/.openclaw/workspace > /data/.openclaw/http-server.log 2>&1 &

# 5. Testar Docker CLI
echo ""
echo "5. Testando Docker CLI..."
docker ps 2>/dev/null && echo "✅ Docker CLI funciona!" || echo "❌ Docker CLI não funciona"

# 6. Testar serviços
echo ""
echo "6. Testando serviços..."
sleep 3
echo "- HTTP Server:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8000/carteira-app.html
echo "- OpenClaw Gateway:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:18789/ || echo "Gateway não responde (pode estar a iniciar)"

# 7. Criar script de inicialização automática
echo ""
echo "7. Criando script de inicialização automática..."
cat > /data/.openclaw/start-autonomo.sh << 'EOF'
#!/bin/bash
# Script de inicialização para container autónomo

echo "Iniciando serviços autónomos..."

# Servidor HTTP
pkill -f "http.server 8000" 2>/dev/null || true
nohup python3 -m http.server 8000 --directory /data/.openclaw/workspace > /data/.openclaw/http-server.log 2>&1 &

# Gateway OpenClaw (se não estiver em execução)
if ! pgrep -f "openclaw-gateway" > /dev/null; then
    openclaw gateway start 2>/dev/null || true
fi

echo "Serviços iniciados:"
echo "- HTTP Server: porta 8000"
echo "- OpenClaw Gateway: porta 18789"
echo "- Docker CLI: disponível"
echo "- Root access: disponível"
EOF
chmod +x /data/.openclaw/start-autonomo.sh

echo ""
echo "=== CONFIGURAÇÃO COMPLETA ==="
echo "✅ Ferramentas instaladas"
echo "✅ Segurança configurada"
echo "✅ Servidor HTTP iniciado"
echo "✅ Script de inicialização criado"
echo ""
echo "Para reiniciar serviços: /data/.openclaw/start-autonomo.sh"
echo "Log HTTP: /data/.openclaw/http-server.log"
echo ""
echo "Container autónomo pronto!"