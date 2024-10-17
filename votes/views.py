from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from votes.models import Vote
from votes.serializers import VoteSerializer


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


class VoteDetail(generics.RetrieveDestroyAPIView):  # Changed from LikeDetail
    """
    Retrieve a vote or delete it by id if you own it.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = VoteSerializer
    queryset = Vote.objects.all()
