# Carteira de Investimentos - Criptomoedas e Ações

Aplicação web completa para gestão de portfólio de investimentos em criptomoedas e ações, com suporte a múltiplas moedas (BRL, USD, EUR).

## 🚀 Funcionalidades

### Gestão de Portfólio
- ✅ Adicionar/remover ativos (criptomoedas e ações)
- ✅ Quantidade, preço médio de compra e data de entrada
- ✅ Visualização completa do portfólio
- ✅ Valor atual, variação percentual, lucro/prejuízo por ativo
- ✅ Total consolidado em múltiplas moedas (BRL, USD, EUR)

### Acompanhamento em Tempo Real
- ✅ Cotações atualizadas via APIs públicas
  - Criptomoedas: CoinGecko API
  - Ações: Yahoo Finance
- ✅ Gráficos de evolução do portfólio (7d, 30d, 90d, 1y)
- ✅ Indicadores visuais de alta/baixa

### Feed de Notícias
- ✅ Notícias do mercado agregadas via RSS
- ✅ Fontes: CoinDesk (cripto), Reuters (ações), InfoMoney (geral)
- ✅ Filtro por categoria (cripto, ações, macro)

### Interface
- ✅ Design limpo e responsivo (desktop + mobile)
- ✅ Dashboard com resumo, gráfico e notícias
- ✅ Tabela detalhada com ordenação e filtros
- ✅ Suporte a 3 moedas: BRL (R$), USD ($), EUR (€)

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript puro (Vanilla JS)
- **Gráficos**: Chart.js
- **Ícones**: Font Awesome
- **Fontes**: Google Fonts (Inter)
- **Persistência**: localStorage
- **APIs Externas**:
  - CoinGecko (criptomoedas)
  - Yahoo Finance (ações)
  - ExchangeRate.host (taxas de câmbio)
  - AllOrigins.win (proxy RSS para evitar CORS)

## 📁 Estrutura do Projeto

```
carteira-investimentos/
├── index.html          # Interface principal
├── style.css           # Estilos e responsividade
├── app.js              # Lógica principal da aplicação
├── api.js              # Integrações com APIs externas
├── portfolio.js        # Gestão do portfólio (localStorage)
├── charts.js           # Gráficos e visualizações
└── README.md           # Esta documentação
```

## 🚀 Como Executar

### Método 1: Servidor Local (Recomendado)

```bash
# Navegue até a pasta do projeto
cd carteira-investimentos

# Use Python (qualquer versão)
python -m http.server 8000

# Ou use Node.js com serve
npx serve .
```

Acesse no navegador: `http://localhost:8000`

### Método 2: Abrir Diretamente
Simplesmente abra o arquivo `index.html` no navegador (algumas APIs podem ter restrições de CORS).

## 💡 Uso Rápido

### 1. Dados de Exemplo
Para popular com dados de demonstração:
1. Abra o console do navegador (F12)
2. Execute:
```javascript
app.portfolio.generateSampleData();
app.updateUI();
```

### 2. Adicionar Ativo
1. Selecione o tipo (Criptomoeda ou Ação)
2. Digite o símbolo (ex: BTC, AAPL, SAP)
3. Informe quantidade, preço de compra e data
4. Selecione a moeda da compra (BRL, USD, EUR)
5. Clique em "Adicionar ao Portfólio"

### 3. Visualizar em Diferentes Moedas
Use o seletor no cabeçalho para alternar entre:
- **BRL (R$)**: Real brasileiro
- **USD ($)**: Dólar americano
- **EUR (€)**: Euro

## 🔧 APIs Utilizadas

### CoinGecko API
- **Endpoint**: `https://api.coingecko.com/api/v3`
- **Uso**: Busca de criptomoedas por símbolo e obtenção de preços
- **Limitações**: Pública, rate limit moderado

### Yahoo Finance
- **Endpoint**: `https://query1.finance.yahoo.com/v7/finance/quote`
- **Uso**: Cotações de ações em tempo real
- **Nota**: Pode ter restrições de CORS em alguns navegadores

### ExchangeRate.host
- **Endpoint**: `https://api.exchangerate.host/latest`
- **Uso**: Taxas de câmbio USD/BRL/EUR
- **Limitações**: Gratuito, atualizações diárias

### RSS Feeds (via AllOrigins)
- **Proxy**: `https://api.allorigins.win/raw?url=`
- **Fontes**:
  - CoinDesk: Notícias de criptomoedas
  - Reuters: Notícias de mercado
  - InfoMoney: Notícias financeiras brasileiras

## 🎨 Personalização

### Adicionar Nova Moeda
1. Em `index.html`: Adicionar opção no seletor
2. Em `app.js`: Atualizar `currencyMap` e `formatCurrency`
3. Em `api.js`: Atualizar `getExchangeRates()`

### Adicionar Novo Feed de Notícias
1. Em `api.js`: Adicionar URL ao array `feeds` em `getMarketNews()`
2. Definir categoria apropriada

### Alterar Estilos
- Cores: Variáveis CSS em `:root` no `style.css`
- Layout: Grid/Flexbox no `style.css`

## ⚠️ Limitações e Considerações

### CORS (Cross-Origin Resource Sharing)
- Algumas APIs (Yahoo Finance) podem bloquear requisições diretas
- Soluções:
  1. Usar servidor proxy próprio
  2. Configurar backend como intermediário
  3. Usar extensões do navegador para desenvolvimento

### Rate Limits
- APIs públicas têm limites de requisições
- A aplicação implementa cache básico no localStorage
- Para uso intensivo, considere:
  - Obter API keys próprias
  - Implementar cache mais robusto
  - Usar WebSocket para atualizações em tempo real

### Precisão Histórica
- O histórico salva valores totais diários
- Conversões entre moedas usam taxas do dia atual
- Para relatórios precisos, considere salvar taxas históricas

## 🔄 Melhorias Futuras

### Prioridade Alta
1. **Backend simples**: Node.js/Express para persistência em nuvem
2. **Autenticação**: Login para múltiplos usuários
3. **Exportação**: CSV/PDF dos relatórios

### Prioridade Média
1. **Alertas**: Notificações por preço-alvo
2. **Dividendos**: Acompanhamento de proventos
3. **Taxas**: Cálculo automático de taxas de corretagem

### Prioridade Baixa
1. **Análise técnica**: Indicadores básicos
2. **Comparativos**: Benchmarks vs índices
3. **Mobile app**: Versão nativa via React Native

## 📄 Licença

Este projeto é para fins educacionais e demonstração. As APIs utilizadas possuem seus próprios termos de uso.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Crie um Pull Request

## 📞 Suporte

Para questões ou sugestões:
- Abra uma issue no repositório
- Consulte a documentação das APIs utilizadas

---

**Nota**: Esta aplicação é uma demonstração técnica. Não oferece aconselhamento financeiro. Consulte um profissional qualificado para decisões de investimento.