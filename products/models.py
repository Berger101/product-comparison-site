from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    """
    Product model, related to 'owner', i.e., a User instance.
    Represents a product in the comparison site.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='images/', default='default_image.png', blank=True, null=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    features = models.TextField(blank=True)
    keywords = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['-created_at']  # Default ordering by date created

    def __str__(self):
        return f'{self.id} {self.name}'
