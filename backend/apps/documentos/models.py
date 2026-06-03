from django.db import models


class DocumentoEmitido(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="documentos_emitidos",
    )
    produtor_nome = models.CharField(max_length=180, blank=True)
    produtor_cpf = models.CharField(max_length=14, blank=True)
    tipo_documento = models.CharField(max_length=120)
    gerado_por = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="documentos_gerados",
    )
    gerado_por_nome = models.CharField(max_length=180, blank=True)
    data_geracao = models.DateTimeField(auto_now_add=True)
    payload = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.tipo_documento} - {self.produtor_nome}"
