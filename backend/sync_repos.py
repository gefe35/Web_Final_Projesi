import os
import sys
import django
import urllib.request
import json

# Setup Django environment
sys.path.append('/Users/goktugefemadran/Desktop/Web_Dersi_Proje/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from profile_info.models import Project

username = 'gefe35'
url = f'https://api.github.com/users/{username}/repos'
print(f"Fetching repos for {username}...")

try:
    with urllib.request.urlopen(url) as response:
        if response.status == 200:
            repos = json.loads(response.read().decode())
            print(f"Found {len(repos)} repositories.")
            
            for index, repo in enumerate(repos):
                project, created = Project.objects.update_or_create(
                    name=repo['name'],
                    defaults={
                        'description': repo.get('description') or '',
                        'language': repo.get('language') or '',
                        'github_url': repo.get('html_url', ''),
                        'stars': repo.get('stargazers_count', 0),
                        'forks': repo.get('forks_count', 0),
                        'order': index,
                        'is_active': True
                    }
                )
                if created:
                    print(f"Created: {repo['name']}")
                else:
                    print(f"Updated: {repo['name']}")
                    
            print("Sync complete.")
        else:
            print(f"Failed to fetch repositories. Status Code: {response.status}")
except Exception as e:
    print(f"An error occurred: {e}")
