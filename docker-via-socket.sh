#!/bin/bash
# 🐳 Docker via socket workaround
# Usa o socket Docker diretamente

DOCKER_SOCKET="/var/run/docker.sock"

if [ -S "$DOCKER_SOCKET" ]; then
    # Método 1: Usar curl para Docker API
    echo "🚀 Método 1: Docker API via curl"
    curl --unix-socket $DOCKER_SOCKET "http://localhost/v1.45/containers/json" 2>/dev/null | head -2
    
    # Método 2: Criar wrapper Python
    cat > /tmp/docker_wrapper.py << 'EOF'
import socket
import json
import sys

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
sock.connect('/var/run/docker.sock')

cmd = sys.argv[1] if len(sys.argv) > 1 else 'GET /containers/json HTTP/1.1\r\nHost: localhost\r\n\r\n'
sock.send(cmd.encode())
response = sock.recv(4096)
print(response.decode()[:200])
EOF
    
    echo ""
    echo "🐍 Método 2: Python wrapper"
    python3 /tmp/docker_wrapper.py
    
    # Método 3: Usar docker-cli com sudo (se disponível)
    echo ""
    echo "🔧 Método 3: Tentando docker ps..."
    docker ps 2>/dev/null || echo "❌ Precisa permissões"
    
else
    echo "❌ Socket Docker não encontrado em $DOCKER_SOCKET"
fi

echo ""
echo "🎯 SOLUÇÃO: Executar na VPS:"
echo "sudo usermod -aG docker \$(docker exec openclaw-old id -un)"