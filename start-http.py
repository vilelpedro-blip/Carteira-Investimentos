#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Mudar para o diretório do workspace
os.chdir('/data/.openclaw/workspace')

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Log simplificado
        sys.stderr.write(f"HTTP {self.address_string()} - {format%args}\n")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"✅ Servidor HTTP iniciado na porta {PORT}")
    print(f"📁 Diretório: {os.getcwd()}")
    print(f"🌐 URLs:")
    print(f"   http://localhost:{PORT}/teste-real.html")
    print(f"   http://localhost:{PORT}/carteira-final.html")
    print(f"   http://localhost:{PORT}/")
    print("\nPressiona Ctrl+C para parar\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServidor HTTP parado")
        sys.exit(0)