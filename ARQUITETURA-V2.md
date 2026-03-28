# 🏗️ ARQUITETURA HÍBRIDA OPENCLAW (V2)

## 📊 VISÃO GERAL
Arquitetura de 2 containers com workspace partilhado:
- **Container A:** `openclaw-old` → Produção/Telegram (usuário node, segurança)
- **Container B:** `openclaw-root` → DevOps/root (usuário root, acesso Docker)

## 🐳 CONTAINERS

### 1. openclaw-old (PRODUÇÃO)
- **ID:** 354cf978046f
- **Usuário:** node
- **Portas:** 45154 (OpenClaw Gateway)
- **Propósito:** Sessão Telegram atual, produção segura
- **Workspace:** /data/.openclaw (montado)
- **Acesso Docker:** ✅ (usuário no grupo docker)

### 2. openclaw-root (DEVOPS)
- **ID:** 40a7204cea00
- **Usuário:** root
- **Portas:** 8000, 8080, 9000, 18789
- **Propósito:** Operações Docker, servidor HTTP, root access
- **Workspace:** /data/.openclaw (montado)
- **Socket Docker:** ✅ montado

## 📁 WORKSPACE PARTILHADO
- **Path:** /data/.openclaw
- **Sincronização:** Alterações em qualquer container refletem no outro
- **Arquivos importantes:**
  - /data/.openclaw/workspace/ → Projetos
  - /data/.openclaw/workspace/carteira-final.html → Aplicação carteira
  - /data/.openclaw/workspace/.clawrc → Aliases e ferramentas

## 🌐 SERVIÇOS

### Servidor HTTP
- **Porta:** 9000 (ambos containers)
- **Arquivos:** carteira-final.html, teste-real.html
- **URL local:** http://localhost:9000/carteira-final.html

### OpenClaw Gateway
- **openclaw-old:** Porta 45154
- **openclaw-root:** Porta 18789
- **Segurança:** Configurada (dangerouslyDisableDeviceAuth: false)

## 🛠️ FERRAMENTAS DISPONÍVEIS
- Docker CLI (acesso total)
- curl, wget, git, nano, vim, htop
- Node.js, npm, Python3, pip3
- Homebrew (instalação local)

## 🔒 SEGURANÇA
- Container produção: usuário `node` (privilegios limitados)
- Container DevOps: usuário `root` (isolado)
- Workspace partilhado: apenas dados, não processos
- Gateway OpenClaw: autenticação ativa

## 🚀 PRÓXIMOS PASSOS
1. Deploy carteira para Vercel (acesso externo)
2. Configurar CI/CD automático
3. Expandir para outros projetos
