#!/bin/bash
# ============================================================
# update.sh — Mevcut sitenin kodunu güncelle (root olarak çalıştır)
# Kullanım: bash update.sh
# ============================================================
set -e

APP_DIR="/opt/gefeblog"

echo "=== [1/4] Repo güncelleniyor ==="
git -C "$APP_DIR" pull

echo "=== [2/4] Python bağımlılıkları ==="
"$APP_DIR/venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt" -q

echo "=== [3/4] Angular build + collectstatic ==="
if [ -d "$APP_DIR/frontend/dist/frontend/browser" ]; then
    cp -r "$APP_DIR/frontend/dist/frontend/browser/." "$APP_DIR/backend/staticfiles/frontend/"
fi

cd "$APP_DIR/backend"
"$APP_DIR/venv/bin/python" manage.py migrate --noinput
"$APP_DIR/venv/bin/python" manage.py collectstatic --noinput -v 0

echo "=== [4/4] Servis yeniden başlatılıyor ==="
chown -R www-data:www-data "$APP_DIR"
systemctl restart gefeblog

echo "Güncelleme tamamlandı. Durum:"
systemctl status gefeblog --no-pager
