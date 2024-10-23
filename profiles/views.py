from django.db.models import Count
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    List all profiles.
    No create view as profile creation is handled by django signals.
    """
    queryset = Profile.objects.annotate(
        # Updated from post to product
        products_count=Count('owner__product', distinct=True),
        favorites_count=Count('owner__favorites', distinct=True)
    ).order_by('-products_count')
    serializer_class = ProfileSerializer
    filter_backends = [
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner__favorites__product',
    ]
    ordering_fields = [
        'products_count',
        'favorites_count',
        'owner__favorites__created_at',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a profile if you're the owner.
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.annotate(
        products_count=Count('owner__product', distinct=True),
        favorites_count=Count('owner__favorites', distinct=True)
    ).order_by('-created_at')
    serializer_class = ProfileSerializer
