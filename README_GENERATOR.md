# Generator Artykułów Blogowych - Uproszczona Wersja

Prosty system do generowania artykułów na bloga przy użyciu OpenAI GPT-4.

## 📋 Jak to działa

1. **Edytujesz** plik `topics.txt` - wpisujesz tematy artykułów (jeden temat w linii)
2. **Uruchamiasz** skrypt `node scripts/generate-articles.js`
3. **Skrypt generuje** artykuły w formacie JSON w katalogu `content/posts/`
4. **Robisz commit i push** - Vercel automatycznie deployuje zmiany

## 🚀 Szybki Start

### 1. Ustaw klucz API OpenAI

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

Klucz API możesz uzyskać z: https://platform.openai.com/api-keys

### 2. Edytuj listę tematów

Otwórz plik `topics.txt` i dodaj tematy artykułów:

```
Jak wybrać odpowiednią żywicę do garażu
Przygotowanie podłoża pod posadzkę żywiczną
Posadzka żywiczna w kuchni - zalety i wady
...
```

### 3. Wygeneruj artykuły

```bash
node scripts/generate-articles.js
```

### 4. Sprawdź wyniki

Artykuły zostaną utworzone w katalogu `content/posts/` jako pliki JSON.

### 5. Opublikuj

```bash
git add content/posts/*.json
git commit -m "Dodaj nowe artykuły"
git push
```

Vercel automatycznie opublikuje nowe artykuły.

## 📁 Struktura Plików

```
posadzki-zywiczne/
├── topics.txt                  # Lista tematów do wygenerowania
├── scripts/
│   └── generate-articles.js    # Skrypt generujący artykuły
├── content/posts/              # Wygenerowane artykuły (JSON)
│   ├── article-slug-1.json
│   ├── article-slug-2.json
│   └── ...
└── .env.example                # Szablon zmiennych środowiskowych
```

## 📝 Format Artykułu (JSON)

Każdy wygenerowany artykuł zawiera:

```json
{
  "id": "article-slug",
  "slug": "article-slug",
  "title": "Tytuł artykułu",
  "excerpt": "Krótki opis...",
  "content": "Pełna treść HTML...",
  "author": {
    "name": "Damian",
    "avatar": "/profilowe.png",
    "bio": "Specjalista ds. posadzek przemysłowych"
  },
  "publishedAt": "2025-11-13",
  "updatedAt": "2025-11-13",
  "category": "Porady",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": "8 min",
  "image": {
    "url": "/placeholder-image.jpg",
    "alt": "Tytuł artykułu",
    "caption": "Ilustracja do artykułu"
  },
  "seo": {
    "metaTitle": "Tytuł SEO",
    "metaDescription": "Opis SEO",
    "keywords": ["keyword1", "keyword2"],
    "canonicalUrl": "https://posadzkizywiczne.com/blog/article-slug"
  },
  "featured": false,
  "status": "published"
}
```

## ⚙️ Szczegóły Techniczne

### Wymagania

- Node.js (wersja 18 lub wyższa)
- Klucz API OpenAI
- Dostęp do internetu

### Jak działa skrypt

1. Wczytuje tematy z pliku `topics.txt`
2. Dla każdego tematu:
   - Wysyła zapytanie do OpenAI GPT-4o-mini
   - Generuje artykuł 2000-3000 słów w języku polskim
   - Tworzy slug URL-friendly
   - Zapisuje jako JSON w `content/posts/`
3. Pomija artykuły, które już istnieją
4. Wyświetla podsumowanie (sukces/błędy)

### Konfiguracja OpenAI

- Model: `gpt-4o-mini`
- Temperatura: 0.8 (kreatywność)
- Max tokens: 4000
- Format odpowiedzi: JSON

## 💰 Koszty

Przybliżone koszty OpenAI API:
- **Jeden artykuł**: ~$0.15-0.25
- **20 artykułów**: ~$3-5

## 🔧 Rozwiązywanie Problemów

### Błąd: OPENAI_API_KEY not set

Ustaw zmienną środowiskową:
```bash
export OPENAI_API_KEY="your-key"
```

Lub dodaj do pliku `.env` (nie commituj tego pliku!):
```
OPENAI_API_KEY=your-key
```

### Błąd: topics.txt not found

Upewnij się, że plik `topics.txt` istnieje w głównym katalogu projektu.

### Artykuł już istnieje

Skrypt automatycznie pomija artykuły, które już istnieją w `content/posts/`.
Jeśli chcesz ponownie wygenerować artykuł, usuń stary plik JSON.

### Rate Limiting

Skrypt automatycznie dodaje 1-sekundową przerwę między generowaniem artykułów,
aby uniknąć przekroczenia limitów API.

## 📚 Przykłady Użycia

### Wygeneruj wszystkie artykuły z topics.txt

```bash
node scripts/generate-articles.js
```

### Testowanie (sprawdź składnię)

```bash
node --check scripts/generate-articles.js
```

### Wygeneruj tylko część artykułów

Edytuj `topics.txt`, zostaw tylko tematy, które chcesz wygenerować.

## 🎨 Dostosowywanie

### Zmiana długości artykułów

Edytuj `scripts/generate-articles.js`, linia z promptem:
```javascript
- Write 2000-3000 words in Polish  // Zmień na 1000-2000 lub 3000-5000
```

### Zmiana kategorii

Domyślna kategoria to "Porady". Możesz ją zmienić w skrypcie lub
pozwolić OpenAI generować różne kategorie.

### Zmiana autora

Edytuj sekcję `author` w `scripts/generate-articles.js`:
```javascript
author: {
  name: "Twoje Imię",
  avatar: "/twoj-avatar.png",
  bio: "Twój opis"
}
```

## ✅ Checklist Przed Uruchomieniem

- [ ] Zainstalowano Node.js
- [ ] Ustawiono OPENAI_API_KEY
- [ ] Utworzono/edytowano topics.txt z tematami
- [ ] Uruchomiono skrypt
- [ ] Sprawdzono wygenerowane pliki JSON
- [ ] Wykonano commit i push
- [ ] Zweryfikowano na Vercel

## 🆘 Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź logi w konsoli
2. Upewnij się, że klucz API jest prawidłowy
3. Sprawdź, czy masz środki na koncie OpenAI
4. Zweryfikuj format pliku topics.txt

---

**Status:** ✅ Gotowy do użycia
**Wersja:** Uproszczona (bez automatyzacji, bez zdjęć)
