from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import AboutMe
from .serializers import AboutMeSerializer, RegisterSerializer
from drf_spectacular.utils import extend_schema

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="register_user",
        summary="Yeni kullanıcı kaydı oluştur",
        description="Dışarıdan kullanıcı kayıt olmak için kullanılır. Şifre eşleşmesi ve validasyon içerir.",
        request=RegisterSerializer,
        responses={201: RegisterSerializer}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Kullanıcı başarıyla oluşturuldu.",
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AboutMeView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        # Using a fixed UUID to ensure singleton behavior (only 1 record exists in the DB)
        obj, created = AboutMe.objects.get_or_create(
            id="00000000-0000-0000-0000-000000000000",
            defaults={
                "name_surname": "Göktuğ Efe Madran",
                "age": 20,
                "city": "İzmir",
                "profession": "Siber Güvenlik Uzmanı & Full-Stack Geliştirici",
                "school": "Konak Kavram Meslek Yüksekokulu - Siber Güvenlik Teknolojileri",
                "linkedin_url": "https://www.linkedin.com",
                "github_url": "https://github.com",
                "bio_paragraph": "Konak Kavram Meslek Yüksekokulu'nda Siber Güvenlik Teknolojileri öğrencisiyim. Siber güvenlik analitiği, sızma testleri ve güvenli yazılım geliştirme metodolojileri ile ilgileniyorum. aliabdaal.com web sitesinden esinlenerek oluşturduğum bu kişisel web sitesinde, hem teknik hem de teknik olmayan konulardaki bilgi ve birikimlerimi paylaşıyorum."
            }
        )
        return obj

    @extend_schema(
        operation_id="get_about_me",
        summary="Hakkımda bilgilerini getir",
        description="Veritabanındaki tekil Hakkımda (About Me) kaydını döner. Eğer henüz kayıt yoksa varsayılan değerlerle oluşturur.",
        responses={200: AboutMeSerializer}
    )
    def get(self, request):
        obj = self.get_object()
        serializer = AboutMeSerializer(obj, context={'request': request})
        return Response(serializer.data)

    @extend_schema(
        operation_id="update_about_me",
        summary="Hakkımda bilgilerini güncelle",
        description="Sadece yetkilendirilmiş (Authenticated) kullanıcıların Hakkımda alanlarını güncellemesine izin verir. Fotoğraf yüklemeyi destekler.",
        request=AboutMeSerializer,
        responses={200: AboutMeSerializer}
    )
    def put(self, request):
        obj = self.get_object()
        serializer = AboutMeSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
