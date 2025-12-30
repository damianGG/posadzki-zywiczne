# Personalizacja PDF Kosztorysu

## Aktualne Ulepszenia

PDF został wzbogacony o:
- ✅ **Kolorowy nagłówek** z nazwą firmy "POSADZKI ŻYWICZNE"
- ✅ **Sekcję "O FIRMIE"** z opisem działalności
- ✅ **Sekcję "KONTAKT"** z linkiem do strony i Instagram
- ✅ **Sekcję "REALIZACJE"** z linkiem do portfolio
- ✅ **Profesjonalny layout** z kolorowym brandingiem

## Jak Dalej Personalizować PDF

### 1. Zmiana Kolorów Firmowych

W pliku `components/blocks/kalkulator-posadzki.tsx` znajdź linię z kolorami:

```typescript
doc.setFillColor(41, 128, 185) // Niebieski pasek
```

Zmień RGB na swoje kolory:
- `(41, 128, 185)` - niebieski
- `(52, 152, 219)` - jaśniejszy niebieski
- `(46, 204, 113)` - zielony
- `(231, 76, 60)` - czerwony

### 2. Dodanie Logo Firmy

Aby dodać logo do PDF:

```typescript
// Po linii: let yPosition = 15
// Dodaj:
const logoData = 'data:image/png;base64,YOUR_BASE64_IMAGE'
doc.addImage(logoData, 'PNG', 15, 8, 30, 15) // x, y, width, height
```

Aby uzyskać base64:
1. Przejdź na stronę: https://www.base64-image.de/
2. Wgraj swoje logo (PNG, max 100KB)
3. Skopiuj wynik i wklej zamiast `YOUR_BASE64_IMAGE`

### 3. Zmiana Tekstów w Sekcji "O FIRMIE"

Znajdź linię:
```typescript
doc.text(formatTextForPDF("Posadzki Zywiczne - Profesjonalne posadzki epoksydowe"), 20, footerY + 12)
```

Zmień tekst na swój własny opis firmy.

### 4. Aktualizacja Danych Kontaktowych

Zmień:
```typescript
doc.text(formatTextForPDF("Web: posadzkizywiczne.com"), 20, footerY + 38)
doc.text(formatTextForPDF("Instagram: @posadzkizywiczne"), 20, footerY + 43)
```

Na swoje dane:
```typescript
doc.text(formatTextForPDF("Tel: +48 123 456 789"), 20, footerY + 38)
doc.text(formatTextForPDF("Email: kontakt@twojafirma.pl"), 20, footerY + 43)
doc.text(formatTextForPDF("Web: www.twojafirma.pl"), 20, footerY + 48)
```

### 5. Dodanie QR Kodu do Strony/Instagram

Wygeneruj QR kod na: https://www.qr-code-generator.com/

Następnie dodaj do PDF:
```typescript
const qrCodeData = 'data:image/png;base64,YOUR_QR_CODE_BASE64'
doc.addImage(qrCodeData, 'PNG', pageWidth - 40, footerY + 5, 30, 30)
```

### 6. Zmiana Układu Footer

Obecnie footer ma 3 sekcje:
- O FIRMIE (lewa)
- KONTAKT (środek-lewo)
- REALIZACJE (prawa)

Możesz dodać więcej sekcji lub zmienić pozycje `x`:
```typescript
doc.text(formatTextForPDF("NOWA SEKCJA"), 80, footerY + 32) // x=80 dla środka
```

## Przykładowy Kompletny Customowy Footer

```typescript
// Footer z pełnymi danymi
const footerY = pageHeight - 65 // Zwiększ wysokość footera

doc.setFillColor(41, 128, 185) // Niebieski
doc.rect(0, footerY - 5, pageWidth, 65, 'F')

// Logo
const logoData = 'data:image/png;base64,YOUR_LOGO'
doc.addImage(logoData, 'PNG', 20, footerY, 40, 20)

// Dane kontaktowe
doc.setTextColor(255, 255, 255) // Biały tekst
doc.setFontSize(10)
doc.setFont("helvetica", "bold")
doc.text("KONTAKT", 70, footerY + 10)

doc.setFont("helvetica", "normal")
doc.setFontSize(9)
doc.text("Tel: +48 123 456 789", 70, footerY + 16)
doc.text("Email: kontakt@firma.pl", 70, footerY + 22)
doc.text("www.firma.pl", 70, footerY + 28)

// Social media
doc.setFont("helvetica", "bold")
doc.text("SOCIAL MEDIA", 130, footerY + 10)
doc.setFont("helvetica", "normal")
doc.text("Instagram: @twojafirma", 130, footerY + 16)
doc.text("Facebook: /twojafirma", 130, footerY + 22)
doc.text("LinkedIn: /company/twojafirma", 130, footerY + 28)

// QR Code do strony
const qrCode = 'data:image/png;base64,YOUR_QR'
doc.addImage(qrCode, 'PNG', pageWidth - 35, footerY + 5, 25, 25)
```

## Testowanie Zmian

Po wprowadzeniu zmian:
1. Zapisz plik
2. Odśwież stronę w przeglądarce
3. Przejdź przez kalkulator i wygeneruj PDF
4. Sprawdź czy wszystkie zmiany są widoczne

## Dodatkowe Zasoby

- **jsPDF Dokumentacja**: http://raw.githack.com/MrRio/jsPDF/master/docs/
- **Generator kolorów RGB**: https://www.rapidtables.com/web/color/RGB_Color.html
- **Base64 Image Converter**: https://www.base64-image.de/
- **QR Code Generator**: https://www.qr-code-generator.com/

## Potrzebujesz Pomocy?

Jeśli potrzebujesz dodać:
- Logo w określonym miejscu
- Tabelę z cenami usług
- Dodatkowe strony z przykładowymi realizacjami
- Warunki handlowe

Skontaktuj się - możemy to zaimplementować!
