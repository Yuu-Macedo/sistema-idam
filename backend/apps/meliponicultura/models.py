from django.db import models


class EspecieAbelha(models.Model):
    nome_popular = models.CharField(max_length=120)
    nome_cientifico = models.CharField(max_length=160)
    tipo_abelha = models.CharField(max_length=120)
    ativa = models.BooleanField(default=True)

    class Meta:
        ordering = ["nome_popular"]

    def __str__(self):
        return f"{self.nome_popular} ({self.nome_cientifico})"


class Meliponicultura(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="meliponiculturas",
    )
    especie = models.ForeignKey(
        EspecieAbelha,
        on_delete=models.PROTECT,
        related_name="meliponiculturas",
    )
    quantidade_colmeias = models.PositiveIntegerField(default=0)
    producao_mel = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    unidade_producao = models.CharField(max_length=20, default="kg")
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.produtor} - {self.especie.nome_popular}"
