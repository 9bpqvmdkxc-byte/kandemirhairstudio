# ✂️ Kandemir Hair Studio - Randevu Sistemi

Modern, responsive ve kullanıcı dostu bir saç salonu randevu yönetim sistemi.

## 🚀 Özellikler

- ✅ **Randevu Rezervasyonu** - Müşteriler kolayca randevu alabiliyor
- ✅ **Hizmet Seçimi** - 9 farklı hizmet (Saç, Sakal, Keratin, Cilt Bakımı vb.)
- ✅ **Tarih & Saat Seçimi** - İnteraktif takvim ile kolay tarih seçimi
- ✅ **Admin Paneli** - Randevuları yönetme ve meşgul saatler belirleme
- ✅ **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu
- ✅ **Firebase Entegrasyonu** - Veritabanı ile kalıcı veri saklama
- ✅ **SMS Hazırlığı** - SMS gönderme özelliği (Twilio, AWS, Netgsm desteği)

## 📱 Teknoloji Stack

- **Frontend**: React 19 + Vite
- **Database**: Firebase Firestore
- **Styling**: CSS3
- **Deployment**: Vercel (hazır)

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. **Projeyi klonla:**
```bash
git clone https://github.com/yourusername/kandemirhairstudio.git
cd kandemirhairstudio
```

2. **Bağımlılıkları yükle:**
```bash
npm install
```

3. **Environment variables ayarla:**
```bash
cp .env.example .env.local
```

`.env.local` dosyasında Firebase bilgilerini gir:
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# ... diğer bilgiler
```

4. **Geliştirme sunucusunu başlat:**
```bash
npm run dev
```

5. **Tarayıcıda aç:**
```
http://localhost:5173/
```

## 📚 Kullanıcı Rehberi

### Müşteri İçin
1. Ana sayfada ad, soyad, telefon gir
2. Tarihten bir gün seç (takvimden)
3. Hizmet türünü seç (Saç, Sakal, vb.)
4. Uygun saati seç (yeşil = müsait, sarı = seçilmiş, kırmızı = dolu)
5. "Randevu Al" butonuna tıkla

### Admin İçin
1. "Admin Giriş" butonuna tıkla
2. Şifre: **3434**
3. Çalışanı seç ve tarih belirle
4. Randevuları görüntüle ve silebilir
5. Saatleri meşgul olarak işaretleyebilir

## 🔐 Admin Şifresi
```
3434
```

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Vercel'e Deploy
```bash
npm install -g vercel
vercel
```

## 📧 Firebase Kurulumu

1. [firebase.google.com](https://firebase.google.com) adresine git
2. Yeni proje oluştur
3. Firestore Database aktifleştir
4. Web uygulaması ekle
5. Konfigürasyonu kopyala ve `.env.local`'a yapıştır

## 🔗 Koleksiyonlar

### appointments
```
{
  name: string,
  surname: string,
  phone: string,
  date: string (YYYY-MM-DD),
  hour: number,
  kuafor: string,
  service: string,
  createdAt: timestamp
}
```

### busyHours
```
{
  date: string,
  worker: string,
  hours: array,
  updatedAt: timestamp
}
```

## 📞 SMS Entegrasyonu (İsteğe Bağlı)

SMS gönderme için `src/utils/smsService.js` dosyasını kullan.

Desteklenen sağlayıcılar:
- Twilio
- AWS SNS
- Netgsm

## 🤝 Katkıda Bulunma

PR'ler ve öneriler hoşlanır!

## 📄 Lisans

MIT

---

**Proje**: Kandemir Hair Studio Randevu Sistemi
**Tarih**: 2 Aralık 2025
