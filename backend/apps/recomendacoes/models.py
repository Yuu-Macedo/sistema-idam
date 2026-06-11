from django.db import models


class RecomendacaoTecnica(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recomendacoes_tecnicas",
    )
    produtor_nome = models.CharField(max_length=180)
    produtor_cpf = models.CharField(max_length=14, blank=True)
    recomendacao = models.TextField()
    tecnico_responsavel = models.CharField(max_length=180, blank=True)
    tecnico = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recomendacoes_tecnicas",
    )
    criado_por = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recomendacoes_criadas",
    )
    data = models.DateField()
    documento = models.TextField(blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recomendação - {self.produtor_nome}"
