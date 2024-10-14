from django.db import IntegrityError
from rest_framework import serializers
from votes.models import Vote  # Changed from Like to Vote


class VoteSerializer(serializers.ModelSerializer):  # Changed from LikeSerializer
    """
    Serializer for the Vote model
    The create method handles the unique constraint on 'owner' and 'product'
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Vote  # Changed from Like to Vote
        fields = ['id', 'created_at', 'owner', 'product']

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'possible duplicate'
            })
