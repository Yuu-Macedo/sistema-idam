from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class TipoUsuario(models.TextChoices):
        ADMINISTRADOR = "administrador", "Administrador"
        TECNICO = "tecnico", "Técnico"
        VISUALIZADOR = "visualizador", "Visualizador"

    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    cargo = models.CharField(max_length=120, blank=True)
    telefone = models.CharField(max_length=30, blank=True)
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.TECNICO,
    )
    ativo = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "nome"]

    def __str__(self):
        return self.nome or self.email
