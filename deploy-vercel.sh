#!/bin/bash
# 🚀 Script de deploy automático para Vercel

echo "🌐 DEPLOY VERCEL AUTOMÁTICO"
echo "==========================="

if [ -z "$1" ]; then
    echo "❌ Uso: ./deploy-vercel.sh [TOKEN_VERCEL]"
    echo ""
    echo "🎯 Como obter token:"
    echo "1. Acesse https://vercel.com/account/tokens"
    echo "2. Crie novo token"
    echo "3. Execute: ./deploy-vercel.sh SEU_TOKEN"
    exit 1
fi

TOKEN="$1"

echo "1. Fazendo deploy para Vercel..."
vercel --prod --token="$TOKEN" --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO!"
    echo "✅ Aplicação publicada na Vercel"
    echo "🌐 URL será mostrada acima"
else
    echo ""
    echo "❌ ERRO NO DEPLOY"
    echo "   • Verifique o token"
    echo "   • Verifique conexão internet"
    echo "   • Tente manualmente: vercel --prod --token=SEU_TOKEN"
fi
