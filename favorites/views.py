from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Favorite
from .serializers import FavoriteSerializer
from django.db import IntegrityError


class FavoriteList(generics.ListCreateAPIView):
    """
    List favorites or create a favorite if logged in.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        # Return only the favorites belonging to the logged-in user
        return Favorite.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(owner=self.request.user)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'This product is already favorited by you.'
            })


class FavoriteDetail(generics.RetrieveDestroyAPIView):
    """
    Retrieve or delete a favorite.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        # Restrict the queryset to favorites belonging to the logged-in user only
        return Favorite.objects.filter(owner=self.request.user)
