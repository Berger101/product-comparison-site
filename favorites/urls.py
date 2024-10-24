from django.urls import path
from favorites import views

urlpatterns = [
    path('favorites/', views.FavoriteList.as_view(),
         name='favorite-list-create'),
    path('favorites/<int:pk>/', views.FavoriteDetail.as_view(),
         name='favorite-detail'),
]
