from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from votes.models import Vote
from votes.serializers import VoteSerializer
from rest_framework import serializers


class VoteList(generics.ListCreateAPIView):
    """
    List votes or create a vote if logged in.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def perform_create(self, serializer):
        # Ensure that the rating is within the allowed range (1-5)
        rating = self.request.data.get('rating')
        if rating and 1 <= int(rating) <= 5:
            serializer.save(owner=self.request.user)
        else:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5.")


class VoteDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a vote.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()

    def perform_update(self, serializer):
        # Ensure the new rating is valid before saving
        rating = self.request.data.get('rating')
        if rating and 1 <= int(rating) <= 5:
            serializer.save()
        else:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5.")
