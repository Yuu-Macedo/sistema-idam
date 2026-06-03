from django.db import models


class Comunidade(models.Model):
    nome = models.CharField(max_length=160)
    municipio = models.CharField(max_length=120)
    localizacao = models.CharField(max_length=255, blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome"]
        unique_together = ["nome", "municipio"]

    def __str__(self):
        return f"{self.nome} - {self.municipio}"
