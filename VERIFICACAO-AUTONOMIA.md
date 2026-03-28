# VERIFICAÇÃO DE AUTONOMIA

## O que o novo container deve conseguir fazer:

### ✅ JÁ CONSEGUE (container atual):
1. Gerar/editar arquivos HTML no workspace
2. Servir arquivos via HTTP (porta 8000)
3. Gateway OpenClaw (porta 18789)
4. Telegram bot conectado

### 🚀 VAI CONSEGUIR (novo container autónomo):
1. **Docker CLI completo** (gerir containers, imagens)
2. **Updates de sistema** (apt-get update/upgrade)
3. **Instalação de pacotes** (apt, pip, npm)
4. **Acesso root** para configurações avançadas
5. **Portas mapeadas** para acesso externo
6. **Auto-restart** (--restart unless-stopped)

## Comandos que vou poder executar:

### Docker Management:
```bash
docker ps                    # Listar containers
docker images               # Listar imagens
docker exec                 # Executar em outros containers
docker build               # Construir imagens
docker-compose             # Gerir multi-container
```

### System Updates:
```bash
apt-get update             # Atualizar lista de pacotes
apt-get upgrade            # Atualizar sistema
apt-get install <pkg>      # Instalar qualquer pacote
```

### Package Installation:
```bash
# Python
pip install <package>

# Node.js
npm install <package>

# System tools
apt-get install curl wget git vim nano htop
```

### File Generation:
```bash
# HTML/CSS/JS
echo "<html>...</html>" > arquivo.html

# Scripts
cat > script.sh << 'EOF'
#!/bin/bash
# código
EOF

# Configurações
vim /etc/config/file.conf
```

## Limitações removidas:

### ❌ ANTES (container atual):
- ❌ Docker CLI: Não funciona (sem permissão)
- ❌ System updates: Não possível (sem root)
- ❌ Apt install: Não disponível
- ❌ Port mapping: Não configurado
- ❌ Auto-restart: Não configurado

### ✅ DEPOIS (container autónomo):
- ✅ Docker CLI: Funciona (root + socket)
- ✅ System updates: Possível (root access)
- ✅ Apt install: Disponível
- ✅ Port mapping: 8000, 8080, 9000, 18789
- ✅ Auto-restart: Configurado

## Segurança considerations:

### ⚠️ Riscos do container root:
1. **Acesso total** ao sistema do container
2. **Pode instalar/remover** qualquer pacote
3. **Pode modificar** configurações críticas
4. **Acesso ao Docker socket** = controlo sobre outros containers

### 🔒 Mitigações implementadas:
1. **Configurações perigosas desativadas** no OpenClaw
2. **Apenas portas necessárias** expostas
3. **Volumes persistentes** para dados importantes
4. **Logs centralizados** para auditoria

## Verificação pós-instalação:

```bash
# 1. Testar Docker
docker ps
docker version

# 2. Testar sistema
apt-get update
which curl wget git

# 3. Testar serviços
curl http://localhost:8000/carteira-app.html
curl http://localhost:18789/

# 4. Testar permissões
whoami
id
ls -la /var/run/docker.sock
```

## Migração completa:

### Status atual:
- Container: `354cf978046f` (usuário node, sem root)
- Funcionalidade: Limitada
- Autonomia: Baixa

### Status novo:
- Container: `openclaw-autonomo` (usuário root)
- Funcionalidade: Completa
- Autonomia: Total

### Plano de migração:
1. Criar novo container (root + Docker socket)
2. Configurar tudo dentro
3. Testar exaustivamente
4. Parar container antigo
5. Manter apenas o autónomo

## Notas finais:
- **Backup automático** das configurações via volumes
- **Logs persistentes** em `/var/log/openclaw/`
- **Workspace preservado** em `/data/.openclaw/`
- **Restart automático** em caso de falha
- **Tudo num único container** simplificado