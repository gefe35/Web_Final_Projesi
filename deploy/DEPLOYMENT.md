# gefeblog.twinshareapp.com — VDS Deployment

## Gereksinimler
- Ubuntu 22.04+ VDS
- Root SSH erişimi
- A kaydı: `gefeblog.twinshareapp.com` → VDS IP

---

## Adım 1 — VDS'e SSH ile gir

```bash
ssh root@<VDS_IP>
```

---

## Adım 2 — setup.sh içindeki REPO_URL'yi düzenle

`deploy/setup.sh` dosyasında şu satırı bul ve değiştir:
```
REPO_URL="https://github.com/KULLANICI_ADI/REPO_ADI.git"
```

Örnek: `REPO_URL="https://github.com/goktugefe/blog.git"`

---

## Adım 3 — Repoyu VDS'e gönder ve scripti çalıştır

**Seçenek A — GitHub ile (önerilen)**
```bash
# Önce kodu GitHub'a push et (PC'den):
git add deploy/ backend/core/settings.py backend/.env.production.example
git commit -m "feat: VDS deployment files"
git push

# Sonra VDS'te:
apt install -y git
git clone https://github.com/KULLANICI/REPO.git /opt/gefeblog
bash /opt/gefeblog/deploy/setup.sh
```

**Seçenek B — rsync ile (GitHub yoksa)**
```bash
# PC'den (Git Bash veya WSL):
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='venv' --exclude='pg_data' \
  /c/Users/mstfa/Desktop/Web_Dersi_Proje/ root@<VDS_IP>:/opt/gefeblog/

# VDS'te:
bash /opt/gefeblog/deploy/setup.sh
```

---

## Adım 4 — .env production ayarlarını yap

```bash
nano /opt/gefeblog/backend/.env
```

İçerik (SECRET_KEY'i değiştir!):
```
DEBUG=False
SECRET_KEY=<python3 -c "import secrets; print(secrets.token_urlsafe(60))" ile üret>
ALLOWED_HOSTS=gefeblog.twinshareapp.com
```

---

## Adım 5 — Servisi yeniden başlat

```bash
systemctl restart gefeblog
systemctl status gefeblog
```

---

## Sonrası

| Komut | Ne yapar |
|-------|----------|
| `journalctl -u gefeblog -f` | Canlı logları izle |
| `bash /opt/gefeblog/deploy/update.sh` | Kodu güncelleyip yeniden başlat |
| `systemctl status gefeblog` | Servis durumu |
| `nginx -t && systemctl reload nginx` | Nginx config test + reload |

### Admin paneli
`https://gefeblog.twinshareapp.com/admin/`
- Kullanıcı: `admin`
- Şifre: `admin12345` ← **İlk girişte mutlaka değiştir!**
