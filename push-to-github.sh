#!/bin/bash
# 🚀 Push automático para GitHub

echo "🐙 PUSH PARA GITHUB"
echo "=================="

if [ -z "$1" ]; then
    echo "❌ Uso: ./push-to-github.sh [URL_REPOSITORIO_GITHUB]"
    echo ""
    echo "🎯 Como criar repositório:"
    echo "1. Acesse https://github.com"
    echo "2. Clique 'New repository'"
    echo "3. Nome: carteira-investimentos"
    echo "4. Público (não inicializar com README)"
    echo "5. Copie URL: https://github.com/SEU_USUARIO/carteira-investimentos.git"
    echo "6. Execute: ./push-to-github.sh https://github.com/SEU_USUARIO/carteira-investimentos.git"
    exit 1
fi

REPO_URL="$1"

echo "1. Inicializando Git..."
git init
git add .
git commit -m "Carteira de investimentos - deploy $(date +%Y-%m-%d)"

echo "2. Conectando ao GitHub..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo "3. Fazendo push..."
git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || git branch -M main && git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 PUSH CONCLUÍDO!"
    echo "✅ Arquivos enviados para GitHub"
    echo "🌐 URL do repositório: $REPO_URL"
    echo ""
    echo "🚀 PRÓXIMO PASSO:"
    echo "1. Acesse https://vercel.com"
    echo "2. 'Add New Project'"
    echo "3. Importe do GitHub"
    echo "4. Selecione este repositório"
    echo "5. Deploy automático!"
else
    echo ""
    echo "❌ ERRO NO PUSH"
    echo "   • Verifique URL do repositório"
    echo "   • Verifique permissões GitHub"
    echo "   • Tente manualmente: git push -u origin main"
fi
