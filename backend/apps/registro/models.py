from django.db import models


class Registro(models.Model):
    class Status(models.TextChoices):
        RASCUNHO = "rascunho", "Rascunho"
        FINALIZADO = "finalizado", "Finalizado"
        SUSPENSO = "suspenso", "Suspenso"

    produtor = models.OneToOneField(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="registro",
    )
    numero_registro = models.CharField(max_length=60, unique=True)
    data_registro = models.DateField()
    possui_carteira = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RASCUNHO,
    )
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.numero_registro
