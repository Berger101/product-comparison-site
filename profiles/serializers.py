from rest_framework import serializers
from .models import Profile
from followers.models import Follower
from products.models import Product  # Changed import from Post to Product


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    following_id = serializers.SerializerMethodField()
    profile_image = serializers.ReadOnlyField(source='image.url')

    # count products, followers, and following
    products_count = serializers.SerializerMethodField()  # Updated from posts_count
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_following_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            following = Follower.objects.filter(
                owner=user, followed=obj.owner
            ).first()
            return following.id if following else None
        return None

    def get_products_count(self, obj):  # Updated from get_posts_count
        # Count the number of products the profile owner has created
        # Changed from Post to Product
        return Product.objects.filter(owner=obj.owner).count()

    def get_followers_count(self, obj):
        # Count how many users are following this profile's owner
        return Follower.objects.filter(followed=obj.owner).count()

    def get_following_count(self, obj):
        # Count how many users this profile's owner is following
        return Follower.objects.filter(owner=obj.owner).count()

    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'created_at', 'updated_at', 'name',
            'content', 'image', 'is_owner', 'following_id', 'profile_image',
            'products_count', 'followers_count', 'following_count'  # Updated from posts_count
        ]
