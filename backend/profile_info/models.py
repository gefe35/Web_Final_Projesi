import uuid
from django.db import models


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Proje Adı")
    description = models.TextField(verbose_name="Açıklama")
    language = models.CharField(max_length=50, blank=True, verbose_name="Programlama Dili")
    github_url = models.URLField(max_length=255, blank=True, verbose_name="GitHub URL")
    stars = models.IntegerField(default=0, verbose_name="Yıldız")
    forks = models.IntegerField(default=0, verbose_name="Fork")
    order = models.IntegerField(default=0, verbose_name="Sıra")
    is_active = models.BooleanField(default=True, verbose_name="Aktif")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Güncellenme")

    class Meta:
        verbose_name = "Proje"
        verbose_name_plural = "Projeler"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class AboutMe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_surname = models.CharField(max_length=100, verbose_name="İsim Soyisim")
    age = models.IntegerField(verbose_name="Yaş")
    city = models.CharField(max_length=100, verbose_name="Yaşadığım Şehir")
    profession = models.CharField(max_length=100, verbose_name="Meslek")
    school = models.CharField(max_length=200, verbose_name="Okul / Üniversite", default="Konak Kavram Meslek Yüksekokulu - Siber Güvenlik Teknolojileri")
    linkedin_url = models.URLField(max_length=255, verbose_name="LinkedIn URL", blank=True, null=True)
    github_url = models.URLField(max_length=255, verbose_name="Github URL", blank=True, null=True)
    bio_paragraph = models.TextField(verbose_name="Uzun Açıklama Paragrafı")
    photo = models.ImageField(upload_to="profile_photos/", verbose_name="Güncel Fotoğraf", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Son Güncelleme")

    class Meta:
        verbose_name = "Hakkımda"
        verbose_name_plural = "Hakkımda"

    def __str__(self):
        return self.name_surname


class ContactMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Ad Soyad")
    email = models.EmailField(verbose_name="E-posta")
    subject = models.CharField(max_length=200, verbose_name="Konu")
    message = models.TextField(verbose_name="Mesaj")
    is_read = models.BooleanField(default=False, verbose_name="Okundu")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Gönderilme Tarihi")

    class Meta:
        verbose_name = "İletişim Mesajı"
        verbose_name_plural = "İletişim Mesajları"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"
