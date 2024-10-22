from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Favorite(models.Model):
    """
    Favorite model, represents a user's favorite products.
    Related to 'user' (a User instance) and 'product' (a Product instance).
    """
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('owner', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.owner} favorites {self.product.name}"
