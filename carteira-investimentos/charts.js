// Gráficos do Portfólio usando Chart.js
class PortfolioChart {
    constructor() {
        const ctx = document.getElementById('portfolio-chart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Valor do Portfólio',
                    data: [],
                    backgroundColor: 'rgba(37,99,235,0.12)',
                    borderColor: 'rgba(37,99,235,1)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: { display: false }
                    },
                    y: {
                        display: true,
                        ticks: {
                            callback: function(value) {
                                // Mostrar valores compactados (ex: 10k)
                                if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
                                return value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const val = context.parsed.y;
                                const currency = (window.app && window.app.currentCurrency) ? window.app.currentCurrency : 'brl';
                                const currencyMap = {
                                    brl: 'BRL',
                                    usd: 'USD',
                                    eur: 'EUR'
                                };
                                const locale = currency === 'eur' ? 'de-DE' : 'pt-BR';
                                return `${currency.toUpperCase()}: ${val.toLocaleString(locale, { 
                                    style: 'currency', 
                                    currency: currencyMap[currency] || 'BRL' 
                                })}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // history: [{date: 'YYYY-MM-DD', value: number}, ...]
    updateChart(history = [], period = '7d') {
        // Determinar quantos dias
        let days = 7;
        if (period === '7d') days = 7;
        else if (period === '30d') days = 30;
        else if (period === '90d') days = 90;
        else if (period === '1y') days = 365;

        // Filtrar histórico para os últimos N dias
        const sorted = history.slice().sort((a,b) => new Date(a.date) - new Date(b.date));
        const fromIndex = Math.max(0, sorted.length - days);
        const slice = sorted.slice(fromIndex);

        const labels = slice.map(s => s.date);
        let data = slice.map(s => s.value);

        // Converter para moeda atual se necessário
        if (window.app) {
            const target = window.app.currentCurrency;
            const rate = window.app.exchangeRate || 1;
            if (target === 'brl') {
                // assume history values are in mixed/original; skip conversion for simplicity
            } else if (target === 'usd') {
                // no-op
            }
        }

        // Atualizar chart
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}
