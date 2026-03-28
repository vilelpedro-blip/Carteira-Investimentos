// Gestão do Portfólio (localStorage)
class PortfolioManager {
    constructor() {
        this.storageKey = 'investment_portfolio';
        this.historyKey = 'portfolio_history';
        this.assets = [];
        this.history = [];
    }

    // Carregar portfólio do localStorage
    loadPortfolio() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.assets = JSON.parse(saved);
            }
            
            const savedHistory = localStorage.getItem(this.historyKey);
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('Erro ao carregar portfólio:', error);
            this.assets = [];
            this.history = [];
        }
    }

    // Salvar portfólio no localStorage
    savePortfolio() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.assets));
            
            // Adicionar ao histórico diário
            this.updateHistory();
        } catch (error) {
            console.error('Erro ao salvar portfólio:', error);
        }
    }

    // Atualizar histórico do portfólio
    updateHistory() {
        const today = new Date().toISOString().split('T')[0];
        const totalValue = this.calculateTotalValue();
        
        // Verificar se já temos entrada para hoje
        const todayIndex = this.history.findIndex(entry => entry.date === today);
        
        if (todayIndex !== -1) {
            // Atualizar entrada existente
            this.history[todayIndex].value = totalValue;
        } else {
            // Adicionar nova entrada
            this.history.push({
                date: today,
                value: totalValue
            });
            
            // Manter apenas últimos 365 dias
            if (this.history.length > 365) {
                this.history = this.history.slice(-365);
            }
        }
        
        localStorage.setItem(this.historyKey, JSON.stringify(this.history));
    }

    // Calcular valor total do portfólio
    calculateTotalValue() {
        return this.assets.reduce((total, asset) => {
            const currentPrice = asset.currentPrice || asset.purchasePrice;
            return total + (asset.quantity * currentPrice);
        }, 0);
    }

    // Adicionar ativo
    addAsset(asset) {
        this.assets.push(asset);
        this.savePortfolio();
    }

    // Obter ativo por ID
    getAsset(assetId) {
        return this.assets.find(asset => asset.id === assetId);
    }

    // Atualizar ativo
    updateAsset(assetId, updatedAsset) {
        const index = this.assets.findIndex(asset => asset.id === assetId);
        if (index !== -1) {
            this.assets[index] = updatedAsset;
            this.savePortfolio();
        }
    }

    // Remover ativo
    removeAsset(assetId) {
        const index = this.assets.findIndex(asset => asset.id === assetId);
        if (index !== -1) {
            this.assets.splice(index, 1);
            this.savePortfolio();
        }
    }

    // Obter todos os ativos
    getAssets() {
        return [...this.assets];
    }

    // Obter histórico do portfólio
    getPortfolioHistory() {
        return [...this.history];
    }

    // Limpar portfólio (para testes)
    clearPortfolio() {
        this.assets = [];
        this.history = [];
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.historyKey);
    }

    // Gerar dados de exemplo para demonstração
    generateSampleData() {
        const sampleAssets = [
            {
                id: '1',
                type: 'crypto',
                symbol: 'BTC',
                name: 'Bitcoin',
                quantity: 0.5,
                purchasePrice: 150000,
                currentPrice: 320000,
                priceChange24h: 2.5,
                purchaseDate: '2023-01-15',
                currency: 'brl',
                lastUpdated: new Date().toISOString()
            },
            {
                id: '2',
                type: 'crypto',
                symbol: 'ETH',
                name: 'Ethereum',
                quantity: 3.2,
                purchasePrice: 8000,
                currentPrice: 18000,
                priceChange24h: 1.8,
                purchaseDate: '2023-03-20',
                currency: 'brl',
                lastUpdated: new Date().toISOString()
            },
            {
                id: '3',
                type: 'stock',
                symbol: 'AAPL',
                name: 'Apple Inc.',
                quantity: 10,
                purchasePrice: 150,
                currentPrice: 180,
                priceChange24h: 0.5,
                purchaseDate: '2023-06-10',
                currency: 'usd',
                lastUpdated: new Date().toISOString()
            },
            {
                id: '4',
                type: 'stock',
                symbol: 'TSLA',
                name: 'Tesla Inc.',
                quantity: 5,
                purchasePrice: 200,
                currentPrice: 250,
                priceChange24h: -1.2,
                purchaseDate: '2023-08-05',
                currency: 'usd',
                lastUpdated: new Date().toISOString()
            },
            {
                id: '5',
                type: 'stock',
                symbol: 'SAP',
                name: 'SAP SE',
                quantity: 8,
                purchasePrice: 120,
                currentPrice: 140,
                priceChange24h: 0.8,
                purchaseDate: '2023-09-15',
                currency: 'eur',
                lastUpdated: new Date().toISOString()
            },
            {
                id: '6',
                type: 'stock',
                symbol: 'ASML',
                name: 'ASML Holding',
                quantity: 3,
                purchasePrice: 600,
                currentPrice: 750,
                priceChange24h: 1.2,
                purchaseDate: '2023-11-20',
                currency: 'eur',
                lastUpdated: new Date().toISOString()
            }
        ];

        // Gerar histórico de exemplo (últimos 30 dias)
        const history = [];
        const today = new Date();
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            // Valor base com variação aleatória
            const baseValue = 50000;
            const variation = (Math.random() - 0.5) * 0.1; // ±5%
            const value = baseValue * (1 + (i * 0.01) + variation); // Tendência de crescimento
            
            history.push({
                date: date.toISOString().split('T')[0],
                value: Math.round(value)
            });
        }

        this.assets = sampleAssets;
        this.history = history;
        this.savePortfolio();
        
        return this.assets;
    }
}