from rest_framework import serializers
from .models import AboutMe

class AboutMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMe
        fields = [
            'id', 'name_surname', 'age', 'city', 'profession', 
            'school', 'linkedin_url', 'github_url', 'bio_paragraph', 
            'photo', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']
