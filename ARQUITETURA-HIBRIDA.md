# ARQUITETURA HÍBRIDA - DOIS CONTAINERS

## 📊 VISÃO GERAL

Manter DOIS containers Docker em paralelo para máxima flexibilidade e segurança.

### 🏭 CONTAINER PRODUÇÃO (`openclaw-old`)
- **Porta:** 45154
- **Usuário:** `node` (mais seguro)
- **Finalidade:** Produção, Telegram bot, sessões ativas
- **Acesso:** Limitado (usuário não-root)
- **Estado:** ONDE ESTOU AGORA (esta conversa)

### 🔧 CONTAINER ROOT (`openclaw-root`)  
- **Portas:** 8000, 8080, 9000, 18789
- **Usuário:** `root` (acesso total)
- **Finalidade:** DevOps, updates, instalações, Docker management
- **Acesso:** Ilimitado (root + Docker socket)
- **Estado:** Configurado para operações

## 🔄 WORKSPACE PARTILHADO

### ✅ Dados Sincronizados:
- `/data/.openclaw/workspace` → **MESMO diretório físico**
- Arquivos HTML, scripts, configurações
- Alterações num refletem no outro

### ❌ Dados Únicos:
- Processos em execução
- Instalações de pacotes
- Estado das sessões
- Configurações de runtime

## 🚀 COMO USAR

### Para operações NORMAIS (Telegram, assistência):
- **Container:** `openclaw-old` (produção)
- **Porta:** 45154
- **Segurança:** Alta (usuário node)

### Para operações AVANÇADAS (updates, instalações):
- **Container:** `openclaw-root` (devops)
- **Portas:** 8000 (HTTP), 18789 (Gateway)
- **Acesso:** Root total

## 📋 COMANDOS ÚTEIS

### Verificar containers:
```bash
docker ps | grep openclaw
```

### Aceder container produção:
```bash
docker exec -it openclaw-old bash
```

### Aceder container root:
```bash
docker exec -it openclaw-root bash
```

### Testar serviços:
```bash
# HTTP Server (container root)
curl http://localhost:8000/carteira-app.html

# Gateway produção
curl http://localhost:45154/

# Gateway root  
curl http://localhost:18789/
```

### Scripts de inicialização:
```bash
# Container root
docker exec openclaw-root /data/.openclaw/start-root.sh

# Container produção
docker exec openclaw-old /data/.openclaw/start-prod.sh
```

## 🛡️ CONSIDERAÇÕES DE SEGURANÇA

### Container produção (`node` user):
- ✅ Mais seguro para produção
- ✅ Menos risco de danos acidentais
- ✅ Ideal para Telegram bot público

### Container root (`root` user):
- ⚠️ Poderoso mas perigoso
- ✅ Necessário para updates/instalações
- ✅ Usar apenas quando necessário

## 🔧 MIGRAÇÃO FUTURA (se necessário)

### Para migrar completamente:
1. Configurar Telegram no container root
2. Transferir estado das sessões
3. Testar tudo funciona
4. Parar container produção
5. Manter apenas root

### Para voltar atrás:
1. Recriar container produção
2. Restaurar configurações
3. Manter ambos novamente

## 📞 SUPORTE

- **Problemas produção:** Container `openclaw-old`
- **Problemas root/DevOps:** Container `openclaw-root`
- **Dados partilhados:** Workspace sincronizado
- **Backup automático:** Volumes Docker persistentes

---

**Arquitetura ativa:** ✅ HÍBRIDA (2 containers)
**Data implementação:** 28/03/2026
**Objetivo:** Flexibilidade máxima + segurança + continuidade