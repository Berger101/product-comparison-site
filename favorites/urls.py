from django.urls import path
from favorites import views

urlpatterns = [
    path('favorites/', views.FavoriteListCreateView.as_view(),
         name='favorite-list-create'),
    path('favorites/<int:pk>/', views.FavoriteDetailView.as_view(),
         name='favorite-detail'),
]
