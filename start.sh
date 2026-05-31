#!/bin/bash
set -e

echo "=== Blog Projesi — Replit Başlatma ==="

cd backend

echo "1) Python bağımlılıkları yükleniyor..."
pip install -r requirements.txt -q

echo "2) Veritabanı migrasyonları..."
python manage.py migrate --noinput

echo "3) Admin kullanıcı oluşturuluyor (yoksa)..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@blog.local', 'admin12345')
    print('Admin oluşturuldu: admin / admin12345')
else:
    print('Admin zaten mevcut')
"

echo "4) Örnek veriler yükleniyor (yoksa)..."
python seed_data.py

echo "5) Statik dosyalar toplanıyor..."
python manage.py collectstatic --noinput -v 0

echo "6) Gunicorn başlatılıyor..."
exec gunicorn core.wsgi:application \
  --bind 0.0.0.0:${PORT:-8000} \
  --workers 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
