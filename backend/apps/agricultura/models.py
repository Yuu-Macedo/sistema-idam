from decimal import Decimal

from django.db import models


class Cultura(models.Model):
    class Subtipo(models.TextChoices):
        MANDIOCA = "mandioca", "Mandioca"
        INDUSTRIAIS = "culturas_industriais", "Culturas industriais"
        OUTRAS = "outras_culturas", "Outras culturas"

    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="culturas",
    )
    nome_cultura = models.CharField(max_length=120)
    subtipo = models.CharField(max_length=40, choices=Subtipo.choices, blank=True)
    area_plantada = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    unidade_area = models.CharField(max_length=20, default="ha")
    quantidade_produzida = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    unidade_producao = models.CharField(max_length=20, default="kg")
    formula_calculo = models.CharField(max_length=120, default="quantidade_produzida / area_plantada")
    resultado_calculo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    producao_organica = models.BooleanField(default=False)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome_cultura"]

    def calcular_producao(self):
        if self.area_plantada and self.area_plantada > 0:
            return self.quantidade_produzida / self.area_plantada
        return Decimal("0")

    def save(self, *args, **kwargs):
        self.resultado_calculo = self.calcular_producao()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome_cultura
