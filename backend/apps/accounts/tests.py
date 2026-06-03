from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="tecnico",
            email="tecnico@idam.local",
            password="senha-forte-123",
            nome="Técnico IDAM",
            tipo_usuario="tecnico",
        )

    def test_login_jwt(self):
        response = self.client.post(
            reverse("token_obtain_pair"),
            {"email": "tecnico@idam.local", "password": "senha-forte-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], self.user.email)
