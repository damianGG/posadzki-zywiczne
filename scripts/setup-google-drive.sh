#!/bin/bash
set -e  # Exit on any error

# Google Drive Agent - Setup Script
# Ten skrypt pomoże w konfiguracji Google Drive Agent

echo "================================================"
echo "  Google Drive Agent - Setup Wizard"
echo "================================================"
echo ""

# Sprawdź czy plik .env.local istnieje
if [ ! -f .env.local ]; then
    echo "✓ Tworzenie pliku .env.local..."
    cp .env.example .env.local
    echo "✓ Plik .env.local utworzony z szablonu"
else
    echo "⚠  Plik .env.local już istnieje"
fi

echo ""
echo "Aby skonfigurować Google Drive Agent, musisz:"
echo ""
echo "1. Uzyskać credentials z Google Cloud Console:"
echo "   → https://console.cloud.google.com/"
echo ""
echo "2. Włączyć Google Drive API:"
echo "   → APIs & Services → Library → Google Drive API → Enable"
echo ""
echo "3. Utworzyć API Key:"
echo "   → APIs & Services → Credentials → Create Credentials → API Key"
echo ""
echo "4. Utworzyć OAuth 2.0 Client ID:"
echo "   → APIs & Services → Credentials → Create Credentials → OAuth client ID"
echo "   → Type: Web application"
echo "   → Authorized JavaScript origins: http://localhost:3000"
echo ""
echo "5. Znaleźć ID folderu root w Google Drive:"
echo "   → Otwórz folder w Google Drive"
echo "   → Skopiuj ID z URL: https://drive.google.com/drive/folders/[ID_FOLDERU]"
echo ""
echo "6. Edytować plik .env.local i uzupełnić zmienne:"
echo "   NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=..."
echo "   NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID=..."
echo "   NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID=..."
echo ""
echo "================================================"
echo ""
read -p "Czy chcesz otworzyć .env.local w edytorze? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    else
        echo "Otwórz plik .env.local w swoim ulubionym edytorze"
    fi
fi

echo ""
echo "Następne kroki:"
echo "1. Uzupełnij zmienne w pliku .env.local"
echo "2. Uruchom: npm run dev"
echo "3. Otwórz: http://localhost:3000/admin/google-drive-sync"
echo "4. Zaloguj się do Google Drive i synchronizuj realizacje"
echo ""
echo "Więcej informacji: GOOGLE_DRIVE_AGENT_QUICKSTART.md"
echo ""
