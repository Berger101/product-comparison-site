from rest_framework import serializers
from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Favorite model
    Create method handles the unique constraint on 'product' and 'user'
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    product = serializers.ReadOnlyField(source='product.name')
    product_id = serializers.ReadOnlyField(source='product.id')

    class Meta:
        model = Favorite
        fields = ['id', 'owner', 'product', 'product_id', 'created_at']
