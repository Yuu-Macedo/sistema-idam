from django.db import models


class PAA(models.Model):
    produtor = models.OneToOneField(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="paa",
    )
    participa_paa = models.BooleanField(default=False)
    perfil = models.CharField(max_length=120, blank=True)
    dados_propriedade = models.TextField(blank=True)
    documentos_entregues = models.JSONField(default=list, blank=True)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PAA - {self.produtor}"
