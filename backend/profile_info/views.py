from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .models import AboutMe, Project
from .serializers import AboutMeSerializer, ProjectSerializer, RegisterSerializer
from drf_spectacular.utils import extend_schema

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="register_user",
        summary="Yeni kullanıcı kaydı oluştur",
        request=RegisterSerializer,
        responses={201: {"type": "object", "properties": {"message": {"type": "string"}}}}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Kayıt başarılı"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    @extend_schema(
        operation_id="create_project",
        summary="Yeni proje oluştur",
        request=ProjectSerializer,
        responses={201: ProjectSerializer}
    )
    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Yetkilendirme gerekli."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return None

    @extend_schema(
        operation_id="update_project",
        summary="Projeyi güncelle",
        request=ProjectSerializer,
        responses={200: ProjectSerializer}
    )
    def put(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({"detail": "Proje bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        operation_id="delete_project",
        summary="Projeyi sil"
    )
    def delete(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({"detail": "Proje bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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

