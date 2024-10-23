from rest_framework import serializers
from .models import Favorite
from products.models import Product


class FavoriteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Favorite model
    Create method handles the unique constraint on 'product' and 'user'
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Favorite
        fields = ['id', 'owner', 'product', 'product_name', 'created_at']
