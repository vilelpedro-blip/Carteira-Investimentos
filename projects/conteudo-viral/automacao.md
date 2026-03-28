# Estratégia de Automação — Pipeline de Conteúdo

## Pipeline Diário Automatizado

### Manhã (7h–8h) — Geração Automática
1. Fetch trending topics (APIs)
   - CoinGecko API (crypto trends)
   - Google Trends API (IA topics)
   - NewsAPI (finanças)

2. Feed ao ChatGPT/Claude via API
   - Gera 2 roteiros de vídeo
   - Gera 2 posts de carrossel
   - Gera hooks + CTAs + hashtags

3. Salva tudo em JSON estruturado

### Meio-dia (12h–14h) — Produção Automática
4. HeyGen API → cria vídeos com avatar
5. Kling/Runway API → gera b-roll
6. CapCut API / FFmpeg → montagem automática
7. Canva API → gera carrosséis

### Tarde (18h–21h) — Publicação Automática
8. Buffer/Hootsuite API → agenda publicação
   - TikTok: 18h30
   - YouTube Shorts: 19h
   - Instagram Reels: 19h30
   - Posts: 20h

9. Tracking automático
   - Google Sheets para métricas
   - Alerta se >10K views em 2h

---

## Stack Técnico

| Etapa | Ferramenta | API? | Alternativa |
|-------|-----------|------|-------------|
| Trending | Google Trends + CoinGecko | ✅ | Manual scraping |
| Roteiros | OpenAI API (GPT-5.2) | ✅ | Claude API |
| Avatar | HeyGen API | ✅ | D-ID, Synthesia |
| B-roll | Kling AI API | ❌* | Pexels API |
| Edição | FFmpeg (local) | ✅ | CapCut manual |
| Legendas | Whisper API + Captions.ai | ✅ | Rev.ai |
| Posts | Canva API | ✅ | Bannerbear API |
| Publicação | Buffer API | ✅ | Zapier/Make.com |

*Kling ainda não tem API pública

---

## Arquitetura

```
CRON (7h) → Fetch Trends
    ↓
LLM API → Gera Conteúdo
    ↓
HeyGen API → Cria Vídeos
    ↓
FFmpeg → Monta + Legenda
    ↓
Buffer API → Publica 18h
```

---

## O que PODE ser 100% automático

- ✅ Pesquisa de trending topics
- ✅ Geração de roteiros
- ✅ Criação de vídeos com avatar
- ✅ Legendas automáticas
- ✅ Publicação agendada

## O que PRECISA de supervisão

- ⚠️ **Fact-checking** — LLMs inventam dados
- ⚠️ **Aprovação final** — vídeo pode sair bugado
- ⚠️ **Ajustes de estratégia** — se não performa, mudar

## O que NÃO automatizar (ainda)

- ❌ Responder comentários (toque humano)
- ❌ Brand deals (negociação manual)
- ❌ Pivots de estratégia (decisão humana)

---

## Custo Real

| Item | €/Mês |
|------|-------|
| OpenAI API (GPT-5.2) | €50–€100 |
| HeyGen API (Creator) | €29 |
| Runway API (b-roll) | €35 |
| Buffer Pro | €15 |
| VPS (DigitalOcean) | €12 |
| Canva Pro | €13 |
| **TOTAL** | **€154–€204** |

**ROI esperado:**
- Mês 1-3: Negativo
- Mês 4-6: Break-even
- Mês 7+: Lucro

---

## Plano de Implementação (30 dias)

### Semana 1 — Setup
- Criar contas em todas as plataformas
- Configurar APIs
- Definir templates

### Semana 2 — Primeiro Vídeo Manual
- Testar workflow completo manualmente
- Identificar gargalos
- Ajustar qualidade

### Semana 3 — Semi-Automação
- Automatizar geração de roteiros
- Automatizar publicação
- Produção de vídeo ainda manual

### Semana 4 — Full Automação
- Ligar HeyGen API
- Testar pipeline completo
- Monitorizar métricas

---

## Red Flags 🚨

**Não fazer se:**
- Não tens €200-300 para investir nos primeiros 3 meses
- Não consegues dedicar 1h/dia para supervisionar
- Esperas resultados em 30 dias

**Fazer se:**
- Tens disciplina para testar 90 dias seguidos
- Okay em perder €500-600 antes de lucrar
- Consegues ajustar rápido quando algo não funciona

---

## O que o Claw PODE fazer agora

✅ **Geração de Conteúdo (100% automático)**
- Pesquisar trending topics
- Gerar roteiros completos (60-90s)
- Gerar posts de carrossel (7-10 slides)
- Criar hooks virais
- Escrever CTAs + hashtags
- Salvar em ficheiros estruturados

✅ **Scripts de Automação**
- Script Python completo para pipeline
- Configuração de cron jobs
- Integração com APIs
- Workflow documentado

❌ **O que NÃO pode fazer diretamente**
- Chamar HeyGen API (sem acesso)
- Gerar b-roll com Kling/Runway
- Editar vídeos
- Publicar nas redes (sem tokens de autenticação)

---

## Próximos Passos

**Opção escolhida:** Teste rápido ✅

**Gerado:**
- Roteiro viral sobre Nvidia + AI Tokens
- 65 segundos
- Viral score: 8.5/10

**Próximo:**
1. Produzir o vídeo manualmente (HeyGen)
2. Testar performance
3. Se funcionar → setup automação completa
