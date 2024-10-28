from django.contrib import admin
from django.urls import path, include
# from django.views.generic import TemplateView
from django.http import JsonResponse
from django.shortcuts import render
from .views import logout_route


def custom_404(request, exception):
    # Check if the path starts with /api
    if request.path.startswith('/api'):
        return JsonResponse({'error': 'Not Found'}, status=404)
    else:
        return render(request, 'index.html')


urlpatterns = [
    # path('', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path('api/api-auth/', include('rest_framework.urls')),
    path('dj-rest-auth/logout/', logout_route),
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path(
        'api/dj-rest-auth/registration/', include(
            'dj_rest_auth.registration.urls')
    ),
    path('api/', include('profiles.urls')),
    path('api/', include('products.urls')),
    path('api/', include('comments.urls')),
    path('api/', include('votes.urls')),
    path('api/', include('favorites.urls')),
]

# Set the custom 404 handler to use the function defined above
handler404 = custom_404
