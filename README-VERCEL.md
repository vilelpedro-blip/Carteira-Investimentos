# 🎯 Carteira de Investimentos

Aplicação web para gestão de carteira de investimentos.

## 📁 Arquivos principais
- `carteira-final.html` → Versão completa da aplicação
- `teste-real.html` → Versão simplificada para testes

## 🚀 Deploy na Vercel
Esta aplicação está configurada para deploy automático na Vercel.

### Configuração (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Como aceder
1. Após deploy, acesse: `https://[nome-do-projeto].vercel.app/carteira-final.html`
2. Para testes: `https://[nome-do-projeto].vercel.app/teste-real.html`

## 📱 Funcionalidades
- Visualização de carteira de investimentos
- Cálculo de totais e percentagens
- Interface responsiva
- Sem backend necessário (estático)
