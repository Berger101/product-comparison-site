from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Vote(models.Model):  # Changed from Like to Vote
    """
    Vote model, related to 'owner' and 'product'.
    'owner' is a User instance and 'product' is a Product instance.
    'unique_together' makes sure a user can't vote for the same product twice.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, related_name='votes', on_delete=models.CASCADE  # Changed likes to votes
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'product']

    def __str__(self):
        return f'{self.owner} {self.product}'
