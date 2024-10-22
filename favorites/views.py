from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteListCreateView(generics.ListCreateAPIView):
    """
    View for listing a user's favorites and allowing them to add new ones.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = FavoriteSerializer
    queryset = Favorite.objects.all()

    # def get_queryset(self):
    #     return Favorite.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FavoriteDetailView(generics.RetrieveDestroyAPIView):
    """
    View for retrieving or deleting a specific favorite item.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FavoriteSerializer
    queryset = Favorite.objects.all()

    # def get_queryset(self):
    #     return Favorite.objects.filter(owner=self.request.user)
