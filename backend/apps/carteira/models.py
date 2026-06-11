from django.db import models


class Carteira(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="carteiras",
    )
    registro = models.ForeignKey(
        "registro.Registro",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="carteiras",
    )
    numero_carteira = models.CharField(max_length=80)
    tipo_carteira = models.CharField(max_length=80)
    data_emissao = models.DateField(null=True, blank=True)
    data_validade = models.DateField(null=True, blank=True)
    orgao_emissor = models.CharField(max_length=120, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["produtor", "numero_carteira"]

    def __str__(self):
        return self.numero_carteira
