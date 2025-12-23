# Przewodnik Konfiguracji Email dla Konkursu

## Co było nie tak?

System konkursu nie wysyłał emaili z powodu następujących problemów:

1. **Brak zainstalowanych zależności** - Pakiet `nodemailer` był zdefiniowany w `package.json`, ale nie był zainstalowany w `node_modules`
2. **Brak wysyłki przy ponownym zgłoszeniu** - Gdy użytkownik próbował zgłosić się ponownie tym samym emailem, system mówił że "wysłał ponownie kod", ale faktycznie tego nie robił
3. **Brak walidacji konfiguracji** - System nie sprawdzał czy zmienne środowiskowe EMAIL_USER i EMAIL_PASS są ustawione
4. **Ograniczone logowanie** - Trudno było debugować problemy z emailami

## Co zostało naprawione?

### 1. Instalacja zależności
```bash
npm install
```
To zainstalowało nodemailer i wszystkie inne brakujące pakiety.

### 2. Dodano wysyłkę emaila przy ponownym zgłoszeniu
Teraz gdy użytkownik próbuje zgłosić się ponownie, email jest faktycznie wysyłany ponownie:

```typescript
// Check if email already exists
const existingEntry = entries.find((entry) => entry.email === email)
if (existingEntry) {
  // Resend confirmation email
  try {
    await sendConfirmationEmail(email, existingEntry.name, existingEntry.code)
  } catch (emailError) {
    console.error("Error resending email:", emailError)
  }
  // ...
}
```

### 3. Dodano walidację konfiguracji
```typescript
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Email credentials not configured...")
  throw new Error("Email configuration missing")
}
```

### 4. Dodano logowanie
```typescript
console.log(`Confirmation email sent successfully to ${email} with code ${code}`)
console.log(`New contest entry created for ${email}`)
```

## Konfiguracja Email (Gmail)

### Plik .env
Upewnij się że masz poprawnie skonfigurowany plik `.env`:

```env
EMAIL_USER=twoj-email@gmail.com
EMAIL_PASS=twoje-haslo-aplikacji
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

### Jak wygenerować App Password (Hasło Aplikacji) w Gmail?

1. **Włącz weryfikację dwuetapową**
   - Przejdź do https://myaccount.google.com/security
   - Znajdź "Weryfikacja dwuetapowa" i włącz ją

2. **Wygeneruj hasło aplikacji**
   - Przejdź do https://myaccount.google.com/apppasswords
   - Wybierz "Poczta" jako aplikację
   - Kliknij "Generuj"
   - Skopiuj wygenerowane hasło (16 znaków, np. "abcd efgh ijkl mnop")

3. **Dodaj do .env**
   ```env
   EMAIL_USER=twoj-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

**WAŻNE:** 
- Użyj hasła aplikacji (App Password), NIE zwykłego hasła do Gmail
- Hasło aplikacji ma format: "xxxx xxxx xxxx xxxx" (ze spacjami lub bez)
- Możesz wkleić je ze spacjami lub bez - oba formaty działają

## Testowanie Konfiguracji

### Użyj skryptu testowego:
```bash
node scripts/test-email.js
```

To wyśle testowego emaila i zweryfikuje czy konfiguracja działa.

Możesz też wysłać na inny adres:
```bash
node scripts/test-email.js test@example.com
```

### Co się stanie przy testowaniu:
1. Skrypt sprawdzi czy EMAIL_USER i EMAIL_PASS są ustawione
2. Zweryfikuje połączenie SMTP
3. Wyśle testowego emaila
4. Pokaże czy operacja się powiodła

### Przykładowy output sukcesu:
```
🧪 Testing Email Configuration...

✅ EMAIL_USER is set: twoj-email@gmail.com
✅ EMAIL_PASS is set: [HIDDEN]
📧 Test recipient: twoj-email@gmail.com

🔄 Attempting to send test email...

⏳ Verifying SMTP connection...
✅ SMTP connection verified successfully!

⏳ Sending test email...
✅ Test email sent successfully!
   Message ID: <...>

🎉 Email configuration is working correctly!
```

## Typowe Problemy i Rozwiązania

### Problem: "EAUTH - Authentication failed"
**Przyczyna:** Nieprawidłowe dane logowania

**Rozwiązanie:**
1. Sprawdź czy używasz hasła aplikacji (App Password), nie zwykłego hasła
2. Sprawdź czy weryfikacja dwuetapowa jest włączona
3. Wygeneruj nowe hasło aplikacji: https://myaccount.google.com/apppasswords
4. Upewnij się że nie ma literówek w EMAIL_USER (pełny adres email)

### Problem: "ECONNECTION - Connection failed"
**Przyczyna:** Problemy z siecią lub firewall

**Rozwiązanie:**
1. Sprawdź połączenie z internetem
2. Sprawdź czy firewall nie blokuje połączeń SMTP
3. Sprawdź czy port 587 lub 465 nie jest zablokowany

### Problem: Email się nie wyświetla
**Rozwiązanie:**
1. Sprawdź folder SPAM
2. Sprawdź czy email nie został oznaczony jako spam
3. Dodaj EMAIL_USER do kontaktów

### Problem: "Email configuration missing"
**Przyczyna:** Brak zmiennych środowiskowych

**Rozwiązanie:**
1. Upewnij się że plik `.env` istnieje w głównym katalogu projektu
2. Sprawdź czy zawiera EMAIL_USER i EMAIL_PASS
3. Zrestartuj serwer deweloperski po zmianach w .env

## Testowanie Konkursu

### 1. Uruchom serwer deweloperski:
```bash
npm run dev
```

### 2. Przejdź do strony konkursu:
```
http://localhost:3000/konkurs
```

### 3. Wypełnij formularz:
- Wpisz imię (min. 2 znaki)
- Wpisz email
- Kliknij "Weź udział w konkursie"

### 4. Sprawdź:
- [ ] Pojawił się kod konkursowy na stronie
- [ ] Email został wysłany (sprawdź skrzynkę pocztową)
- [ ] W konsoli serwera pojawił się log: "Confirmation email sent successfully..."

### 5. Test ponownego zgłoszenia:
- Wypełnij formularz tym samym emailem ponownie
- Sprawdź czy otrzymałeś email z tym samym kodem
- Komunikat powinien mówić "Ten email był już użyty. Wysłaliśmy ponownie Twój kod."

## Logi do Monitorowania

W konsoli serwera będziesz widzieć:
- ✅ `Confirmation email sent successfully to email@example.com with code PXZ-XXXXXXXX`
- ✅ `New contest entry created for email@example.com`
- ❌ `Error sending email: [szczegóły błędu]`
- ❌ `Email credentials not configured...`

## Monitoring w Produkcji

Po wdrożeniu na produkcję (np. Vercel):

1. **Ustaw zmienne środowiskowe w Vercel:**
   - Settings → Environment Variables
   - Dodaj EMAIL_USER
   - Dodaj EMAIL_PASS
   - Dodaj ADMIN_EMAIL

2. **Sprawdź logi:**
   - Vercel Dashboard → Project → Logs
   - Szukaj komunikatów o wysyłce emaili

3. **Testuj:**
   - Wypełnij formularz konkursowy
   - Sprawdź czy email przychodzi
   - Sprawdź logi w Vercel

## Bezpieczeństwo

⚠️ **WAŻNE:**
- NIE commituj pliku `.env` do repozytorium (jest w .gitignore)
- Hasło aplikacji traktuj jak hasło - nikomu nie pokazuj
- Regularnie zmieniaj hasło aplikacji
- Jeśli hasło wycieknie, usuń je w: https://myaccount.google.com/apppasswords

## Alternatywne Rozwiązania Email

Jeśli Gmail sprawia problemy, można użyć innych usług:

### 1. Resend.com (Zalecane dla produkcji)
```bash
npm install resend
```

### 2. SendGrid
```bash
npm install @sendgrid/mail
```

### 3. Mailgun
Dedykowany serwis do wysyłki emaili

### 4. AWS SES
Amazon Simple Email Service

## Wsparcie

Jeśli masz problemy:
1. Sprawdź logi w konsoli serwera
2. Uruchom `node scripts/test-email.js`
3. Sprawdź ten dokument dla rozwiązań typowych problemów
4. Skontaktuj się z zespołem technicznym

## Podsumowanie Zmian

✅ **Naprawiono:**
- Instalacja nodemailer
- Wysyłka emaili przy ponownym zgłoszeniu
- Walidacja konfiguracji email
- Logowanie operacji email

✅ **Dodano:**
- Skrypt testowy email (scripts/test-email.js)
- Dokumentacja konfiguracji
- Szczegółowe komunikaty błędów

✅ **Gotowe do użycia:**
System konkursu jest teraz w pełni funkcjonalny i gotowy do wysyłki emaili!
