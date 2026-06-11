from django.db import models


class Atendimento(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="atendimentos",
    )
    produtor_nome = models.CharField(max_length=180, blank=True)
    produtor_cpf = models.CharField(max_length=14, blank=True)
    tecnico_responsavel = models.CharField(max_length=180, blank=True)
    tecnico = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="atendimentos",
    )
    data = models.DateField(null=True, blank=True)
    tipo = models.CharField(max_length=120, blank=True)
    descricao = models.TextField(blank=True)
    dados = models.JSONField(default=dict, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Atendimento - {self.produtor_nome or self.produtor_id}"
