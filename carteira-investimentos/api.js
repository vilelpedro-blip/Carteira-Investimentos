// Serviço de Integração com APIs Públicas (CoinGecko, Yahoo Finance, ExchangeRate, RSS via allorigins)
class ApiService {
    constructor() {
        this.coingeckoBase = 'https://api.coingecko.com/api/v3';
        this.exchangeBase = 'https://api.exchangerate.host';
        this.yahooBase = 'https://query1.finance.yahoo.com/v7/finance/quote';
        this.rssProxy = 'https://api.allorigins.win/raw?url='; // proxy para evitar CORS
    }

    // Obter taxas de câmbio para todas as moedas (USD, EUR, BRL)
    async getExchangeRates() {
        try {
            // Obter taxas baseadas em USD (padrão da API)
            const url = `${this.exchangeBase}/latest?base=USD&symbols=BRL,EUR`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Erro ao obter taxas de câmbio');
            const data = await res.json();
            
            const rates = {
                usd: {
                    brl: data.rates?.BRL || 5.0,
                    eur: 1.0, // USD para EUR via cálculo indireto
                    usd: 1.0
                },
                eur: {
                    usd: 1.0 / (data.rates?.EUR || 0.85),
                    brl: (data.rates?.BRL || 5.0) / (data.rates?.EUR || 0.85),
                    eur: 1.0
                },
                brl: {
                    usd: 1.0 / (data.rates?.BRL || 5.0),
                    eur: (data.rates?.EUR || 0.85) / (data.rates?.BRL || 5.0),
                    brl: 1.0
                }
            };
            
            // Ajustar USD->EUR diretamente se a API fornecer
            if (data.rates?.EUR) {
                rates.usd.eur = data.rates.EUR;
                rates.eur.usd = 1.0 / data.rates.EUR;
            }
            
            return rates;
        } catch (error) {
            console.error('getExchangeRates error', error);
            // Valores padrão de fallback
            return {
                usd: { brl: 5.0, eur: 0.85, usd: 1.0 },
                eur: { usd: 1.18, brl: 5.88, eur: 1.0 },
                brl: { usd: 0.20, eur: 0.17, brl: 1.0 }
            };
        }
    }

    // Obter dados de ativo (crypto via CoinGecko, stock via Yahoo)
    async getAssetData(symbol, type) {
        if (type === 'crypto') {
            return this.getCryptoData(symbol);
        } else if (type === 'stock') {
            return this.getStockData(symbol);
        }
        return null;
    }

    // CoinGecko: busca o id por símbolo e retorna price em USD
    async getCryptoData(symbol) {
        try {
            const q = encodeURIComponent(symbol);
            const searchUrl = `${this.coingeckoBase}/search?query=${q}`;
            const searchRes = await fetch(searchUrl);
            if (!searchRes.ok) throw new Error('CoinGecko search failed');
            const searchJson = await searchRes.json();
            const coins = searchJson.coins || [];
            // Encontrar moeda com symbol exato (case-insensitive)
            const match = coins.find(c => c.symbol && c.symbol.toLowerCase() === symbol.toLowerCase()) || coins[0];
            if (!match) return null;
            const id = match.id;
            // Buscar dados de mercado
            const marketUrl = `${this.coingeckoBase}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(id)}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;
            const marketRes = await fetch(marketUrl);
            if (!marketRes.ok) throw new Error('CoinGecko markets failed');
            const marketJson = await marketRes.json();
            const coin = marketJson[0];
            if (!coin) return null;
            return {
                name: coin.name,
                currentPrice: coin.current_price, // USD
                priceChange24h: coin.price_change_percentage_24h
            };
        } catch (error) {
            console.error('getCryptoData error', error);
            return null;
        }
    }

    // Yahoo Finance: obter cotação da ação
    async getStockData(symbol) {
        try {
            const url = `${this.yahooBase}?symbols=${encodeURIComponent(symbol)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Yahoo Finance request failed');
            const json = await res.json();
            const quote = json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result[0];
            if (!quote) return null;
            return {
                name: quote.shortName || quote.longName || symbol,
                currentPrice: quote.regularMarketPrice,
                priceChange24h: quote.regularMarketChangePercent
            };
        } catch (error) {
            console.error('getStockData error', error);
            return null;
        }
    }

    // Buscar notícias a partir de alguns RSS feeds (via proxy allorigins)
    async getMarketNews() {
        const feeds = [
            { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'crypto' },
            { url: 'https://www.reuters.com/finance/markets/rss', category: 'stocks' },
            { url: 'https://www.infomoney.com.br/ultimas-noticias/feed/', category: 'stocks' }
        ];

        const results = [];

        for (const feed of feeds) {
            try {
                const proxyUrl = this.rssProxy + encodeURIComponent(feed.url);
                const res = await fetch(proxyUrl);
                if (!res.ok) {
                    console.warn('RSS fetch failed for', feed.url);
                    continue;
                }
                const text = await res.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'text/xml');
                const items = xml.querySelectorAll('item');

                for (let i = 0; i < Math.min(items.length, 8); i++) {
                    const it = items[i];
                    const title = it.querySelector('title') ? it.querySelector('title').textContent : '';
                    const description = it.querySelector('description') ? it.querySelector('description').textContent : '';
                    const link = it.querySelector('link') ? it.querySelector('link').textContent : (it.querySelector('guid') ? it.querySelector('guid').textContent : '');
                    const pubDate = it.querySelector('pubDate') ? new Date(it.querySelector('pubDate').textContent).toISOString() : new Date().toISOString();

                    results.push({
                        title: title,
                        description: this.stripHtml(description).slice(0, 300),
                        url: link,
                        publishedAt: pubDate,
                        category: feed.category
                    });
                }
            } catch (error) {
                console.warn('Error fetching/parsing feed', feed.url, error);
            }
        }

        // Ordenar por data (desc) e limitar
        results.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        return results.slice(0, 20);
    }

    stripHtml(html) {
        return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }
}
