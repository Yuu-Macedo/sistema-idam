from django.db import models


class Localizacao(models.Model):
    class TipoLocalizacao(models.TextChoices):
        RURAL = "zona_rural", "Zona Rural"
        URBANA = "zona_urbana", "Zona Urbana"

    produtor = models.OneToOneField(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="localizacao",
    )
    tipo_localizacao = models.CharField(max_length=20, choices=TipoLocalizacao.choices)
    endereco = models.CharField(max_length=255, blank=True)
    comunidade = models.CharField(max_length=150, blank=True)
    ramal = models.CharField(max_length=120, blank=True)
    ponto_referencia = models.CharField(max_length=255, blank=True)
    acesso = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_tipo_localizacao_display()} - {self.produtor}"
