import uuid
from django.db import models

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
