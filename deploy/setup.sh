#!/bin/bash
# ============================================================
# setup.sh — VDS'e İLK KEZ KURULUM (root olarak çalıştır)
# Kullanım: bash setup.sh
# ============================================================
set -e

DOMAIN="gefeblog.twinshareapp.com"
APP_DIR="/opt/gefeblog"
REPO_URL="https://github.com/KULLANICI_ADI/REPO_ADI.git"  # <- DEĞİŞTİR

echo "=== [1/7] Sistem güncelleniyor ==="
apt update && apt upgrade -y

echo "=== [2/7] Gerekli paketler kuruluyor ==="
apt install -y python3 python3-pip python3-venv git nginx certbot python3-certbot-nginx

echo "=== [3/7] Repo klonlanıyor ==="
if [ -d "$APP_DIR/.git" ]; then
    echo "Repo zaten mevcut, güncelleniyor..."
    git -C "$APP_DIR" pull
else
    git clone "$REPO_URL" "$APP_DIR"
fi

echo "=== [4/7] Python sanal ortam ve bağımlılıklar ==="
python3 -m venv "$APP_DIR/venv"
"$APP_DIR/venv/bin/pip" install --upgrade pip -q
"$APP_DIR/venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt" -q

echo "=== [5/7] .env production dosyası ==="
if [ ! -f "$APP_DIR/backend/.env" ]; then
    cp "$APP_DIR/backend/.env.production.example" "$APP_DIR/backend/.env"
    # Rastgele SECRET_KEY üret
    SECRET=$("$APP_DIR/venv/bin/python" -c "import secrets; print(secrets.token_urlsafe(60))")
    sed -i "s|BURAYA_EN_AZ_50_KARAKTER_RASTGELE_KEY_YAZ|$SECRET|" "$APP_DIR/backend/.env"
    echo "SECRET_KEY otomatik üretildi."
fi

echo "=== [6/7] Django migrate + collectstatic ==="
cd "$APP_DIR/backend"
mkdir -p staticfiles/frontend /var/log/gefeblog

# Angular build git'te var, staticfiles/frontend'e kopyala
if [ -d "$APP_DIR/frontend/dist/frontend/browser" ]; then
    cp -r "$APP_DIR/frontend/dist/frontend/browser/." staticfiles/frontend/
    echo "Angular build kopyalandı."
else
    echo "UYARI: frontend/dist bulunamadı!"
fi

"$APP_DIR/venv/bin/python" manage.py migrate --noinput
"$APP_DIR/venv/bin/python" manage.py collectstatic --noinput -v 0

# Seed data ve admin kullanıcı
"$APP_DIR/venv/bin/python" manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@gefeblog.local', 'admin12345')
    print('Admin oluşturuldu: admin / admin12345  <- ŞİFREYİ HEMEN DEĞİŞTİR!')
"
"$APP_DIR/venv/bin/python" seed_data.py 2>/dev/null || true

echo "=== [7/7] Nginx + systemd + SSL ==="

# systemd service
cp "$APP_DIR/deploy/gefeblog.service" /etc/systemd/system/gefeblog.service
chown -R www-data:www-data "$APP_DIR" /var/log/gefeblog
systemctl daemon-reload
systemctl enable gefeblog
systemctl start gefeblog

# Nginx — önce HTTP ile başlat (certbot için)
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/gefeblog
# SSL satırlarını geçici olarak yorum yap (certbot henüz çalışmadı)
sed -i 's|ssl_certificate|# ssl_certificate|g; s|include /etc/letsencrypt|# include /etc/letsencrypt|g; s|ssl_dhparam|# ssl_dhparam|g; s|listen 443 ssl|listen 443|g' \
    /etc/nginx/sites-available/gefeblog
ln -sf /etc/nginx/sites-available/gefeblog /etc/nginx/sites-enabled/gefeblog
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# SSL sertifikası al (certbot nginx plugin kullan)
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || \
    echo "UYARI: SSL sertifikası alınamadı. Certbot çıktısını kontrol et."

echo ""
echo "=========================================="
echo " KURULUM TAMAMLANDI"
echo " Site: https://$DOMAIN"
echo " Admin: https://$DOMAIN/admin  (admin/admin12345)"
echo " Loglar: journalctl -u gefeblog -f"
echo "=========================================="
