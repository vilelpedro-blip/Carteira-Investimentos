#!/bin/bash
# 🛠️ Setup Tools for OpenClaw
# Executar na VPS para instalar ferramentas nos containers

set -e

echo "🦞 OPENCLAW TOOLS SETUP"
echo "========================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${YELLOW}🔧 $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }

# Verificar Docker
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado na VPS"
    exit 1
fi

# Verificar containers
info "Verificando containers OpenClaw..."
if ! docker ps --format '{{.Names}}' | grep -q 'openclaw-root'; then
    error "Container openclaw-root não encontrado"
    exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -q 'openclaw-old'; then
    error "Container openclaw-old não encontrado"
    exit 1
fi

success "Containers encontrados: openclaw-root e openclaw-old"

# ============================================
# INSTALAÇÃO NO CONTAINER ROOT
# ============================================
echo ""
info "INSTALANDO NO CONTAINER ROOT (acesso total)..."
echo "----------------------------------------"

docker exec openclaw-root bash -c '
echo "🔧 Atualizando sistema..."
apt-get update -y

echo "🔧 Instalando ferramentas básicas..."
apt-get install -y curl wget git nano vim htop net-tools dnsutils jq yq tmux screen tree ncdu

echo "🔧 Instalando Docker CLI..."
apt-get install -y docker.io docker-compose

echo "🔧 Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs npm
fi

echo "🔧 Instalando Python packages..."
apt-get install -y python3-pip python3-venv python3-dev
pip3 install --upgrade pip
pip3 install pandas numpy matplotlib seaborn scikit-learn requests beautifulsoup4

echo "🔧 Instalando ferramentas adicionais..."
apt-get install -y postgresql-client redis-tools sqlite3

echo ""
echo "✅ VERIFICAÇÃO CONTAINER ROOT:"
echo "----------------------------"
echo "Docker: $(docker --version 2>/dev/null || echo "Não instalado")"
echo "Node.js: $(node --version 2>/dev/null || echo "Não instalado")"
echo "Python3: $(python3 --version 2>/dev/null || echo "Não instalado")"
echo "Git: $(git --version 2>/dev/null || echo "Não instalado")"
echo "curl: $(curl --version 2>/dev/null | head -1 || echo "Não instalado")"
'

# ============================================
# INSTALAÇÃO NO CONTAINER PRODUÇÃO (se possível)
# ============================================
echo ""
info "INSTALANDO NO CONTAINER PRODUÇÃO (usuário node)..."
echo "------------------------------------------------"

docker exec openclaw-old bash -c '
echo "🔧 Usando Homebrew para ferramentas..."
if command -v brew &> /dev/null; then
    brew install wget htop nano vim jq tree 2>/dev/null | tail -3
fi

echo "🔧 Atualizando Node.js packages..."
if command -v npm &> /dev/null; then
    npm install -g vercel-cli netlify-cli @angular/cli @vue/cli 2>/dev/null
fi

echo "🔧 Python packages..."
if command -v pip3 &> /dev/null; then
    pip3 install --upgrade pip 2>/dev/null
    pip3 install pandas numpy matplotlib requests 2>/dev/null | tail -2
fi

echo ""
echo "✅ VERIFICAÇÃO CONTAINER PRODUÇÃO:"
echo "--------------------------------"
echo "Node.js: $(node --version 2>/dev/null || echo "Não instalado")"
echo "npm: $(npm --version 2>/dev/null || echo "Não instalado")"
echo "Python3: $(python3 --version 2>/dev/null || echo "Não instalado")"
echo "Git: $(git --version 2>/dev/null || echo "Não instalado")"
'

# ============================================
# CONFIGURAÇÃO FINAL
# ============================================
echo ""
info "CONFIGURAÇÃO FINAL..."
echo "-------------------"

# Dar acesso Docker ao usuário node (se possível)
docker exec openclaw-old bash -c '
if command -v sudo &> /dev/null; then
    echo "🔧 Tentando dar acesso Docker ao usuário node..."
    sudo usermod -aG docker node 2>/dev/null || echo "⚠️  Precisa executar na VPS host"
fi
'

# Criar aliases úteis no workspace
echo "🔧 Criando aliases úteis..."
cat > /data/.openclaw/workspace/.claw_aliases << 'EOF'
# 🦞 OpenClaw Aliases
alias claw-docker='docker exec openclaw-root docker'
alias claw-root='docker exec -it openclaw-root bash'
alias claw-prod='docker exec -it openclaw-old bash'
alias claw-logs='docker logs -f openclaw-old'
alias claw-http='python3 -m http.server 9000'
alias claw-status='docker ps | grep openclaw'
alias claw-update='docker exec openclaw-root apt-get update && docker exec openclaw-root apt-get upgrade -y'

# Funções úteis
claw-deploy() {
    echo "🚀 Deploy para Vercel..."
    cd /data/.openclaw/workspace
    vercel --prod
}

claw-ml() {
    echo "🤖 Iniciando ambiente ML..."
    docker exec openclaw-root python3 -c "import tensorflow as tf; print('TensorFlow:', tf.__version__)"
}
EOF

success "Setup completo!"
echo ""
echo "🎯 FERRAMENTAS INSTALADAS:"
echo "=========================="
echo "• Docker CLI (container root)"
echo "• Node.js + npm (ambos containers)"
echo "• Python + data science libs"
echo "• curl, wget, git, nano, vim, htop"
echo "• jq, yq, tmux, tree, ncdu"
echo "• PostgreSQL client, redis-tools"
echo ""
echo "🚀 COMANDOS DISPONÍVEIS:"
echo "========================"
echo "• claw-docker    - Executar Docker via container root"
echo "• claw-root      - Entrar no container root"
echo "• claw-prod      - Entrar no container produção"
echo "• claw-deploy    - Deploy para Vercel"
echo "• claw-ml        - Testar ambiente ML"
echo ""
echo "📁 Aliases criados em: /data/.openclaw/workspace/.claw_aliases"
echo ""
echo "🦞 O Claw agora tem superpoderes!"