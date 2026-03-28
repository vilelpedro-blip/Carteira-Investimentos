// Aplicação Principal da Carteira de Investimentos
class InvestmentApp {
    constructor() {
        this.portfolio = new PortfolioManager();
        this.api = new ApiService();
        this.chart = new PortfolioChart();
        this.currentCurrency = 'brl';
        this.exchangeRates = {
            usd: { brl: 5.0, eur: 0.85, usd: 1.0 },
            eur: { usd: 1.18, brl: 5.88, eur: 1.0 },
            brl: { usd: 0.20, eur: 0.17, brl: 1.0 }
        };

        this.init();
    }

    async init() {
        // Configurar data atual no formulário
        const dateInput = document.getElementById('asset-date');
        if (dateInput) dateInput.valueAsDate = new Date();

        // Carregar taxas de câmbio
        await this.loadExchangeRates();

        // Carregar portfólio do localStorage
        this.portfolio.loadPortfolio();

        // Configurar event listeners
        this.setupEventListeners();

        // Atualizar interface
        await this.updateUI();

        // Carregar notícias
        this.loadNews();
    }

    async loadExchangeRates() {
        try {
            this.exchangeRates = await this.api.getExchangeRates();
        } catch (error) {
            console.warn('Não foi possível carregar taxas de câmbio, usando valores padrão:', error);
            // Manter valores padrão
        }
    }

    setupEventListeners() {
        // Formulário de adicionar ativo
        const addForm = document.getElementById('add-asset-form');
        if (addForm) addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAsset();
        });

        // Botão de atualizar
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) refreshBtn.addEventListener('click', async () => {
            await this.updateUI();
            this.loadNews();
            this.showToast('Dados atualizados com sucesso!', 'success');
        });

        // Seletor de moeda
        const currencySelect = document.getElementById('currency-select');
        if (currencySelect) currencySelect.addEventListener('change', (e) => {
            this.currentCurrency = e.target.value;
            this.updateUI();
        });

        // Filtro de ativos
        const filterType = document.getElementById('filter-type');
        if (filterType) filterType.addEventListener('change', () => this.updateAssetsTable());

        // Busca de ativos
        const searchInput = document.getElementById('search-assets');
        if (searchInput) searchInput.addEventListener('input', () => this.updateAssetsTable());

        // Controles do gráfico
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.chart.updateChart(this.portfolio.getPortfolioHistory(), e.target.dataset.period);
            });
        });

        // Filtros de notícias
        document.querySelectorAll('.news-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                document.querySelectorAll('.news-filter').forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                this.filterNews(e.target.dataset.category);
            });
        });

        // Modal
        const modal = document.getElementById('asset-modal');
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) closeModal.addEventListener('click', () => modal && (modal.style.display = 'none'));
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

        // Formulário de edição
        const editForm = document.getElementById('edit-asset-form');
        if (editForm) editForm.addEventListener('submit', (e) => { e.preventDefault(); this.editAsset(); });

        // Botão de remover ativo
        const deleteBtn = document.getElementById('delete-asset-btn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteAsset());
    }

    async addAsset() {
        const form = document.getElementById('add-asset-form');
        if (!form) return;
        const formData = new FormData(form);

        const asset = {
            id: Date.now().toString(),
            type: formData.get('asset-type'),
            symbol: formData.get('asset-symbol').toUpperCase(),
            quantity: parseFloat(formData.get('asset-quantity')),
            purchasePrice: parseFloat(formData.get('asset-price')),
            purchaseDate: formData.get('asset-date'),
            currency: formData.get('asset-currency')
        };

        if (!this.validateAsset(asset)) return;

        try {
            const assetData = await this.api.getAssetData(asset.symbol, asset.type);
            if (!assetData) { this.showToast('Ativo não encontrado. Verifique o símbolo.', 'error'); return; }

            asset.name = assetData.name;
            asset.currentPrice = assetData.currentPrice;
            asset.priceChange24h = assetData.priceChange24h || 0;
            asset.lastUpdated = new Date().toISOString();

            this.portfolio.addAsset(asset);
            form.reset();
            document.getElementById('asset-date').valueAsDate = new Date();
            await this.updateUI();
            this.showToast('Ativo adicionado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao adicionar ativo:', error);
            this.showToast('Erro ao adicionar ativo. Tente novamente.', 'error');
        }
    }

    validateAsset(asset) {
        if (!asset.type) { this.showToast('Selecione o tipo de ativo.', 'error'); return false; }
        if (!asset.symbol || asset.symbol.length < 2) { this.showToast('Digite um símbolo válido.', 'error'); return false; }
        if (!(asset.quantity > 0)) { this.showToast('A quantidade deve ser maior que zero.', 'error'); return false; }
        if (!(asset.purchasePrice > 0)) { this.showToast('O preço de compra deve ser maior que zero.', 'error'); return false; }
        if (!asset.purchaseDate) { this.showToast('Selecione uma data de compra.', 'error'); return false; }
        return true;
    }

    openEditModal(assetId) {
        const asset = this.portfolio.getAsset(assetId);
        if (!asset) { this.showToast('Ativo não encontrado.', 'error'); return; }
        document.getElementById('edit-asset-id').value = asset.id;
        document.getElementById('edit-asset-quantity').value = asset.quantity;
        document.getElementById('edit-asset-price').value = asset.purchasePrice;
        document.getElementById('edit-asset-date').value = asset.purchaseDate;
        document.getElementById('asset-modal').style.display = 'flex';
    }

    async editAsset() {
        const assetId = document.getElementById('edit-asset-id').value;
        const asset = this.portfolio.getAsset(assetId);
        if (!asset) { this.showToast('Ativo não encontrado.', 'error'); return; }
        asset.quantity = parseFloat(document.getElementById('edit-asset-quantity').value);
        asset.purchasePrice = parseFloat(document.getElementById('edit-asset-price').value);
        asset.purchaseDate = document.getElementById('edit-asset-date').value;
        asset.lastUpdated = new Date().toISOString();
        this.portfolio.updateAsset(assetId, asset);
        document.getElementById('asset-modal').style.display = 'none';
        await this.updateUI();
        this.showToast('Ativo atualizado com sucesso!', 'success');
    }

    deleteAsset() {
        const assetId = document.getElementById('edit-asset-id').value;
        if (confirm('Tem certeza que deseja remover este ativo?')) {
            this.portfolio.removeAsset(assetId);
            document.getElementById('asset-modal').style.display = 'none';
            this.updateUI();
            this.showToast('Ativo removido com sucesso!', 'success');
        }
    }

    async updateUI() {
        await this.updateAssetPrices();
        this.updatePortfolioSummary();
        this.updateAssetsTable();
        this.updateChart();
    }

    async updateAssetPrices() {
        const assets = this.portfolio.getAssets();
        for (const asset of assets) {
            try {
                const assetData = await this.api.getAssetData(asset.symbol, asset.type);
                if (assetData) {
                    asset.currentPrice = assetData.currentPrice;
                    asset.priceChange24h = assetData.priceChange24h || 0;
                    asset.lastUpdated = new Date().toISOString();
                }
            } catch (error) {
                console.warn(`Erro ao atualizar preço de ${asset.symbol}:`, error);
            }
        }
        this.portfolio.savePortfolio();
    }

    updatePortfolioSummary() {
        const assets = this.portfolio.getAssets();
        let totalValue = 0;
        let totalCost = 0;
        assets.forEach(asset => {
            const cost = asset.quantity * asset.purchasePrice;
            const value = asset.quantity * (asset.currentPrice || asset.purchasePrice);
            totalCost += this.convertCurrency(cost, asset.currency, this.currentCurrency);
            totalValue += this.convertCurrency(value, asset.currency, this.currentCurrency);
        });
        const totalPnl = totalValue - totalCost;
        const totalChange = totalCost > 0 ? ((totalPnl / totalCost) * 100) : 0;
        document.getElementById('total-value').textContent = this.formatCurrency(totalValue, this.currentCurrency);
        document.getElementById('total-pnl').textContent = this.formatCurrency(totalPnl, this.currentCurrency);
        document.getElementById('total-change').textContent = `${totalChange.toFixed(2)}%`;
        document.getElementById('total-assets').textContent = this.portfolio.getAssets().length;
        const pnlElement = document.getElementById('total-pnl');
        const changeElement = document.getElementById('total-change');
        pnlElement.className = `value ${totalPnl >= 0 ? 'pnl-positive' : 'pnl-negative'}`;
        changeElement.className = `value ${totalChange >= 0 ? 'change-positive' : 'change-negative'}`;
    }

    updateAssetsTable() {
        const assets = this.portfolio.getAssets();
        const filterType = document.getElementById('filter-type').value;
        const searchTerm = document.getElementById('search-assets').value.toLowerCase();
        const tbody = document.getElementById('assets-table-body');
        tbody.innerHTML = '';
        const filteredAssets = assets.filter(asset => {
            if (filterType !== 'all' && asset.type !== filterType) return false;
            if (searchTerm && !asset.symbol.toLowerCase().includes(searchTerm) && !asset.name.toLowerCase().includes(searchTerm)) return false;
            return true;
        });
        filteredAssets.forEach(asset => tbody.appendChild(this.createAssetRow(asset)));
        if (filteredAssets.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `\n                <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray-color);">\n                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>\n                    Nenhum ativo encontrado\n                </td>\n            `;
            tbody.appendChild(emptyRow);
        }
    }

    createAssetRow(asset) {
        const row = document.createElement('tr');
        const currentPrice = asset.currentPrice || asset.purchasePrice;
        const value = asset.quantity * currentPrice;
        const cost = asset.quantity * asset.purchasePrice;
        const pnl = value - cost;
        const change = cost > 0 ? ((pnl / cost) * 100) : 0;
        const convertedValue = this.convertCurrency(value, asset.currency, this.currentCurrency);
        const convertedPnl = this.convertCurrency(pnl, asset.currency, this.currentCurrency);
        const convertedPrice = this.convertCurrency(currentPrice, asset.currency, this.currentCurrency);
        const convertedPurchasePrice = this.convertCurrency(asset.purchasePrice, asset.currency, this.currentCurrency);
        row.innerHTML = `
            <td>
                <div class="asset-info">
                    <div class="asset-icon ${asset.type === 'crypto' ? 'crypto-icon' : 'stock-icon'}">
                        ${asset.symbol.charAt(0)}
                    </div>
                    <div>
                        <div class="asset-symbol">${asset.symbol}</div>
                        <div class="asset-name">${asset.name}</div>
                    </div>
                </div>
            </td>
            <td>${asset.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 6 })}</td>
            <td>${this.formatCurrency(convertedPurchasePrice, this.currentCurrency)}</td>
            <td>${this.formatCurrency(convertedPrice, this.currentCurrency)}</td>
            <td class="${change >= 0 ? 'text-success' : 'text-danger'}">${change >= 0 ? '+' : ''}${change.toFixed(2)}%</td>
            <td class="${pnl >= 0 ? 'text-success' : 'text-danger'}">${this.formatCurrency(convertedPnl, this.currentCurrency)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" onclick="app.openEditModal('${asset.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="app.portfolio.removeAsset('${asset.id}'); app.updateUI(); app.showToast('Ativo removido!', 'success')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        return row;
    }

    updateChart() {
        const history = this.portfolio.getPortfolioHistory();
        this.chart.updateChart(history, '7d');
    }

    async loadNews() {
        const newsList = document.getElementById('news-list');
        if (newsList) newsList.innerHTML = '<div class="loading-news"><i class="fas fa-spinner fa-spin"></i> Carregando notícias...</div>';
        try {
            const news = await this.api.getMarketNews();
            this.displayNews(news);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            if (newsList) newsList.innerHTML = `\n                <div class="loading-news">\n                    <i class="fas fa-exclamation-triangle"></i>\n                    <p>Não foi possível carregar as notícias.</p>\n                </div>\n            `;
        }
    }

    displayNews(news) {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;
        newsList.innerHTML = '';
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.dataset.category = item.category;
            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="news-meta">
                    <span class="news-category category-${item.category}">${this.getCategoryName(item.category)}</span>
                    <span>${new Date(item.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>
            `;
            if (item.url) { newsItem.addEventListener('click', () => window.open(item.url, '_blank')); newsItem.style.cursor = 'pointer'; }
            newsList.appendChild(newsItem);
        });
    }

    filterNews(category) {
        document.querySelectorAll('.news-item').forEach(item => { item.style.display = (category === 'all' || item.dataset.category === category) ? 'block' : 'none'; });
    }

    getCategoryName(category) {
        const categories = { 'crypto': 'Criptomoedas', 'stocks': 'Ações', 'macro': 'Macroeconomia' };
        return categories[category] || category;
    }

    convertCurrency(value, fromCurrency, toCurrency) {
        if (!value && value !== 0) return 0;
        if (fromCurrency === toCurrency) return value;
        
        // Usar taxas de câmbio carregadas
        if (this.exchangeRates[fromCurrency] && this.exchangeRates[fromCurrency][toCurrency]) {
            return value * this.exchangeRates[fromCurrency][toCurrency];
        }
        
        // Fallback para conversões básicas
        console.warn(`Taxa de câmbio não encontrada: ${fromCurrency}->${toCurrency}`);
        return value;
    }

    formatCurrency(value, currency) {
        const currencyMap = {
            brl: 'BRL',
            usd: 'USD',
            eur: 'EUR'
        };
        
        const currencyCode = currencyMap[currency] || 'BRL';
        const locale = currency === 'eur' ? 'de-DE' : 'pt-BR'; // Usar locale alemão para EUR (formato europeu)
        
        const formatter = new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: currencyCode, 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
        return formatter.format(value);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.animation = 'slideIn 0.3s ease reverse'; setTimeout(() => container.removeChild(toast), 300); }, 5000);
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => { window.app = new InvestmentApp(); });
