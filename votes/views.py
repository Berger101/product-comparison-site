from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from votes.models import Vote  # Changed from Like to Vote
from votes.serializers import VoteSerializer  # Changed from LikeSerializer


class VoteList(generics.ListCreateAPIView):  # Changed from LikeList
    """
    List votes or create a vote if logged in.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = VoteSerializer  # Changed from LikeSerializer
    queryset = Vote.objects.all()  # Changed from Like to Vote

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class VoteDetail(generics.RetrieveDestroyAPIView):  # Changed from LikeDetail
    """
    Retrieve a vote or delete it by id if you own it.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = VoteSerializer  # Changed from LikeSerializer
    queryset = Vote.objects.all()  # Changed from Like to Vote
