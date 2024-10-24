from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Product
from .serializers import ProductSerializer


class ProductList(generics.ListCreateAPIView):
    """
    List products or create a product if logged in
    The perform_create method associates the product with the logged-in user.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Product.objects.annotate(
        votes_count=Count('votes', distinct=True),
        comments_count=Count('comment', distinct=True)
    ).order_by('-created_at')

    # Add filters for search and ordering
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    # Add fields for filtering
    filterset_fields = [
        'owner__profile',
        'category',
        'price',
    ]
    # Add fields for search functionality
    search_fields = [
        'owner__username',
        'name',
        'price',
        'description',
        'category',
    ]
    # Ordering options, including votes (popularity) and date
    ordering_fields = [
        'votes_count',
        'comments_count',
        'votes__created_at',
        'price',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a product and edit or delete it if you own it.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Product.objects.annotate(
        votes_count=Count('votes', distinct=True),
        comments_count=Count('comment', distinct=True)
    ).order_by('-created_at')
