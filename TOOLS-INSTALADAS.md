# 🛠️ Ferramentas para Instalar no OpenClaw

## 🎯 PRIORIDADE 1 (Essenciais)
- [ ] **Docker CLI** - Gestão de containers
- [ ] **curl/wget** - Download de recursos
- [ ] **git** completo - Versionamento
- [ ] **nano/vim** - Editores avançados
- [ ] **htop** - Monitorização sistema

## 🎯 PRIORIDADE 2 (Produtividade)
- [ ] **Node.js + npm** - Desenvolvimento web
- [ ] **Python 3 + pip** - Scripting/ML
- [ ] **jq/yq** - Processamento JSON/YAML
- [ ] **tmux/screen** - Terminal multiplexer
- [ ] **tree/ncdu** - Navegação ficheiros

## 🎯 PRIORIDADE 3 (Especializadas)
- [ ] **TensorFlow/PyTorch** - Machine Learning
- [ ] **OpenCV** - Processamento imagem
- [ ] **PostgreSQL client** - Bases dados
- [ ] **AWS/GCP CLI** - Cloud management
- [ ] **kubectl/helm** - Kubernetes

## 📋 STATUS ATUAL (container produção)
✅ Já instaladas:
- curl
- git
- nano
- python3
- pip3
- node
- npm

❌ Precisa root/container root:
- Docker CLI
- wget
- htop
- vim
- system tools

## 🚀 COMANDOS PARA INSTALAR

### No container root (`openclaw-root`):
```bash
docker exec openclaw-root bash -c "
apt-get update
apt-get install -y curl wget git nano vim htop docker.io nodejs python3-pip jq tmux tree
pip3 install pandas numpy matplotlib tensorflow-cpu opencv-python
"
```

### No container atual (se possível):
```bash
# Via Homebrew
brew install wget htop vim jq tmux tree

# Via npm global
npm install -g vercel-cli netlify-cli

# Via pip
pip3 install pandas numpy matplotlib
```

## 🔧 APÓS INSTALAÇÃO

### Testar Docker:
```bash
docker ps
docker version
```

### Testar Node.js:
```bash
node --version
npm --version
```

### Testar Python:
```bash
python3 --version
python3 -c "import pandas; print('pandas OK')"
```

## 📊 BENEFÍCIOS

Com estas ferramentas, posso:
1. **Gerir containers Docker** autonomamente
2. **Desenvolver e fazer deploy** de aplicações web
3. **Processar dados** e machine learning
4. **Automatizar tarefas** complexas
5. **Monitorizar sistema** e diagnosticar problemas

## ⚠️ NOTAS
- Container produção (`openclaw-old`) tem usuário `node` (limitado)
- Container root (`openclaw-root`) tem usuário `root` (acesso total)
- Workspace (`/data/.openclaw`) é partilhado entre ambos
- Algumas instalações precisam da VPS (executar comandos como root)