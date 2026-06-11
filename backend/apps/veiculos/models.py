from django.db import models


class Veiculo(models.Model):
    class Status(models.TextChoices):
        DISPONIVEL = "Disponível", "Disponível"
        EM_USO = "Em uso", "Em uso"
        MANUTENCAO = "Em manutenção", "Em manutenção"
        INDISPONIVEL = "Indisponível", "Indisponível"

    placa = models.CharField(max_length=12, unique=True)
    modelo = models.CharField(max_length=120)
    marca = models.CharField(max_length=80, blank=True)
    ano = models.CharField(max_length=4, blank=True)
    cor = models.CharField(max_length=60, blank=True)
    tipo = models.CharField(max_length=80, blank=True)
    quilometragem = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.DISPONIVEL)
    gasolina = models.PositiveSmallIntegerField(default=100)
    observacoes = models.TextField(blank=True)
    responsavel_cadastro = models.CharField(max_length=150, blank=True)
    tecnico_em_uso = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="veiculos_em_uso",
    )
    finalidade_uso = models.CharField(max_length=255, blank=True)
    data_retirada = models.DateTimeField(null=True, blank=True)
    historico_uso = models.JSONField(default=list, blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.placa} - {self.modelo}"
