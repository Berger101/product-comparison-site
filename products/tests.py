from django.contrib.auth.models import User
from .models import Product
from rest_framework import status
from rest_framework.test import APITestCase


class ProductListViewTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username='adam', password='pass')

    def test_can_list_products(self):
        adam = User.objects.get(username='adam')
        Product.objects.create(owner=adam, name='a product')
        response = self.client.get('/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)
        print(len(response.data))

    def test_logged_in_user_can_create_product(self):
        self.client.login(username='adam', password='pass')
        response = self.client.post('/products/', {'name': 'a product'})
        count = Product.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_not_logged_in_cant_create_product(self):
        response = self.client.post('/products/', {'name': 'a product'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ProductDetailViewTests(APITestCase):
    def setUp(self):
        adam = User.objects.create_user(username='adam', password='pass')
        brian = User.objects.create_user(username='brian', password='pass')
        Product.objects.create(owner=adam, name='a product',
                               description='adam product description')
        Product.objects.create(owner=brian, name='another product',
                               description='brian product description')

    def test_can_retrieve_product_using_valid_id(self):
        response = self.client.get('/products/1/')
        self.assertEqual(response.data['name'], 'a product')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_retrieve_product_using_invalid_id(self):
        response = self.client.get('/products/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_product(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put(
            '/products/1/', {'name': 'a new product name'})
        product = Product.objects.filter(
            pk=1).first()
        self.assertEqual(product.name, 'a new product name')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_another_users_product(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put(
            '/products/2/', {'name': 'a new product name'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
