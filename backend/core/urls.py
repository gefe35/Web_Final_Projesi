# pyrefly: ignore [untyped-import]
from django.contrib import admin
# pyrefly: ignore [untyped-import]
from django.urls import path, include, re_path
# pyrefly: ignore [untyped-import]
from django.conf import settings
# pyrefly: ignore [untyped-import]
from django.conf.urls.static import static
# pyrefly: ignore [untyped-import]
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('profile_info.urls')),
    path('api/', include('blog_content.urls')),
]

# Geliştirme modunda medya ve statik dosyaları servis et
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Angular SPA — API ve admin dışındaki tüm route'lar Angular'a yönlendirilir
# WhiteNoise index.html'i zaten sunuyor ama explicit olarak da tanımla
urlpatterns += [
    re_path(r'^(?!api/|admin/|static/|media/).*$',
            TemplateView.as_view(template_name='index.html'),
            name='spa'),
]
