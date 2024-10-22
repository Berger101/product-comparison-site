from rest_framework import serializers
from .models import Profile
from favorites.models import Favorite
from products.models import Product


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    favorite_id = serializers.SerializerMethodField()
    profile_image = serializers.ReadOnlyField(source='image.url')

    # Count products created and favorite products
    products_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_favorite_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            favorite = Favorite.objects.filter(
                owner=user, product__owner=obj.owner).first()
            return favorite.id if favorite else None
        return None

    def get_products_count(self, obj):
        # Count the number of products the profile owner has created
        return Product.objects.filter(owner=obj.owner).count()

    def get_favorites_count(self, obj):  # Updated method
        return Favorite.objects.filter(product__owner=obj.owner).count()

    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image', 'is_owner', 'favorite_id', 'profile_image',
            'products_count', 'favorites_count',
        ]
