from django.urls import path
from .views import AboutMeView

app_name = 'profile_info'

urlpatterns = [
    path('aboutme/', AboutMeView.as_view(), name='aboutme'),
]
