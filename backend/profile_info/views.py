from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .models import AboutMe, Project
from .serializers import AboutMeSerializer, ProjectSerializer
from drf_spectacular.utils import extend_schema


class ProjectListView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="list_projects",
        summary="Proje listesini getir",
        responses={200: ProjectSerializer(many=True)}
    )
    def get(self, request):
        projects = Project.objects.filter(is_active=True)
        return Response(ProjectSerializer(projects, many=True).data)


class AboutMeView(APIView):
    permission_classes = [AllowAny]
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
