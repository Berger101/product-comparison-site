from django.db import IntegrityError
from rest_framework import serializers
from .models import Favorite
from products.serializers import ProductSerializer
from products.models import Product


class FavoriteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Favorite model
    The create method handles the unique constraint on 'owner' and 'product'
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source='product'
    )

    class Meta:
        model = Favorite
        fields = ['id', 'created_at', 'owner', 'product', 'product_id']

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'This product is already favorited by you.'
            })
