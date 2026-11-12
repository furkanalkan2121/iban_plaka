## NFC İşletme Sayfaları

Her işletme için IBAN ve hesap sahibi bilgisi gösteren bir sayfa (`/isletme-slug`),
ve bu sayfaları yönetmek için şifre korumalı bir admin paneli (`/admin`).

### Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000/admin` adresine git.

### Admin girişi

`.env` dosyasındaki şu değerleri değiştir:

```
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me-now"
```

### Veritabanı

SQLite kullanılıyor, veriler `data/app.db` dosyasında tutulur (repoya dahil edilmez).

### Dağıtım (canlıya alma)

- Bir Linux sunucuda veya Vercel/Render gibi bir platformda çalıştırılabilir.
  Not: `better-sqlite3` native modül olduğu için serverless/edge ortamlarda
  (ör. Vercel Edge) çalışmaz — Node.js runtime'ı olan bir ortam gerekir
  (klasik Vercel Node functions, Railway, Render, kendi VPS'in vb.).
- `data/app.db` dosyasının kalıcı bir disk üzerinde olduğundan emin ol,
  yoksa her yeniden başlatmada veriler sıfırlanır.
- `.env` içindeki `ADMIN_PASSWORD` ve `SESSION_SECRET` değerlerini canlıya
  almadan önce mutlaka değiştir.
