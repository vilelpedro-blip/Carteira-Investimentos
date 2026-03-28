# 🚀 SOLUÇÃO DEFINITIVA - Acesso Permanente ao Docker

## 📊 PROBLEMA ATUAL
- OpenClaw roda num container Docker
- Sem acesso ao Docker socket dentro do container
- Não consegue mapear portas ou copiar arquivos
- Usuário precisa executar comandos manualmente na VPS

## ✅ SOLUÇÃO PERMANENTE

### OPÇÃO A: Docker Socket Montado (RECOMENDADO)
```bash
# Na VPS (como root):
# 1. Parar container atual
docker stop [NOME_CONTAINER]

# 2. Reiniciar com acesso total
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /data/.openclaw:/data/.openclaw \
  -p 8000:8000 \
  -p 8080:8080 \
  -p 9000:9000 \
  --name openclaw-com-docker \
  --restart unless-stopped \
  [IMAGEM_ORIGINAL]
```

**VANTAGENS:**
- ✅ Acesso total ao Docker da VPS
- ✅ Pode mapear portas quando quiser
- ✅ Pode copiar arquivos para fora
- ✅ Pode reiniciar serviços
- ✅ Container reinicia automaticamente

### OPÇÃO B: Usuário Docker na VPS
```bash
# Na VPS:
# 1. Criar usuário para OpenClaw
useradd -m -s /bin/bash openclaw-user
usermod -aG docker openclaw-user

# 2. Configurar SSH key
mkdir -p /home/openclaw-user/.ssh
echo "[SSH_PUBLIC_KEY]" >> /home/openclaw-user/.ssh/authorized_keys
chmod 700 /home/openclaw-user/.ssh
chmod 600 /home/openclaw-user/.ssh/authorized_keys
chown -R openclaw-user:openclaw-user /home/openclaw-user

# 3. No container OpenClaw, usar SSH para acessar VPS
```

### OPÇÃO C: Script de Automação
```bash
# /usr/local/bin/openclaw-manage.sh
#!/bin/bash
CONTAINER_ID=$(docker ps -q --filter "name=openclaw")
case "$1" in
  "copy-html")
    docker cp $CONTAINER_ID:/data/.openclaw/workspace/$2 /root/
    ;;
  "map-port")
    docker stop $CONTAINER_ID
    docker run -d -p $2:$3 [OUTROS_PARÂMETROS]
    ;;
  "restart")
    docker restart $CONTAINER_ID
    ;;
  *)
    echo "Comandos: copy-html, map-port, restart"
    ;;
esac
```

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### 1. IDENTIFICAR CONTAINER ATUAL
```bash
docker ps | grep -i openclaw
```

### 2. CRIAR BACKUP DA CONFIGURAÇÃO
```bash
# Salvar configuração atual
docker inspect [CONTAINER_ID] > /root/openclaw-backup.json
docker logs [CONTAINER_ID] > /root/openclaw-logs.txt
```

### 3. IMPLEMENTAR SOLUÇÃO ESCOLHIDA

## 📁 ESTRUTURA DE ARQUIVOS RECOMENDADA
```
/data/.openclaw/
├── workspace/          # Arquivos HTML/JS
├── scripts/           # Scripts de automação
│   ├── deploy-web.sh  # Publicar HTML
│   └── backup.sh      # Backup automático
└── config/           # Configurações
    └── docker-setup.md
```

## 🔧 COMANDOS QUE PRECISAM FUNCIONAR
1. `docker ps` - Ver containers
2. `docker cp` - Copiar arquivos
3. `docker run` - Criar containers
4. `docker stop/start` - Gerenciar
5. `docker port` - Ver portas mapeadas

## ⚠️ CONSIDERAÇÕES DE SEGURANÇA
- Usar volumes apenas para /data/.openclaw
- Não montar todo o filesystem da VPS
- Limitar portas expostas (apenas 8000, 8080, 9000)
- Usar --restart unless-stopped
- Manter logs em /var/log/openclaw/

## 🚀 COMANDO FINAL DEFINITIVO
```bash
# Este comando resolve TODOS os problemas:
docker run -d \
  --name openclaw-permanent \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /data/.openclaw:/data/.openclaw \
  -v /var/log/openclaw:/var/log/openclaw \
  -p 8000:8000 \
  -p 8080:8080 \
  -p 9000:9000 \
  --restart unless-stopped \
  --memory="512m" \
  --cpus="0.5" \
  openclaw/openclaw:latest
```

**IMPLEMENTAÇÃO:** Executar este comando na VPS após backup do container atual.
