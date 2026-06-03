from django.db import models


class CronogramaVisita(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="visitas",
    )
    produtor_nome = models.CharField(max_length=180, blank=True)
    tecnico = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="visitas_tecnicas",
    )
    tecnico_nome = models.CharField(max_length=180, blank=True)
    criado_por = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="cronogramas_criados",
    )
    dia_semana = models.CharField(max_length=30)
    turno = models.CharField(max_length=20, default="manha")
    horario_saida_manha = models.CharField(max_length=20, blank=True)
    horario_entrada_manha = models.CharField(max_length=20, blank=True)
    horario_saida_tarde = models.CharField(max_length=20, blank=True)
    horario_entrada_tarde = models.CharField(max_length=20, blank=True)
    atividade = models.CharField(max_length=255)
    observacoes = models.TextField(blank=True)
    recomendacoes = models.TextField(blank=True)
    cor = models.CharField(max_length=20, blank=True)
    semana = models.DateTimeField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.atividade} - {self.dia_semana}"
