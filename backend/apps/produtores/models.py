from django.db import models


class Produtor(models.Model):
    class Sexo(models.TextChoices):
        MASCULINO = "masculino", "Masculino"
        FEMININO = "feminino", "Feminino"

    class Publico(models.TextChoices):
        HOMEM_JOVEM = "homem_jovem", "Homem jovem - 20 a 29 anos"
        HOMEM_ADULTO = "homem_adulto", "Homem adulto - 30 a 59 anos"
        MULHER_JOVEM = "mulher_jovem", "Mulher jovem - 20 a 29 anos"
        MULHER_ADULTA = "mulher_adulta", "Mulher adulta - 30 a 59 anos"
        JOVEM = "jovem", "Jovem - 13 anos"
        IDOSO = "idoso", "Idoso - 60 anos"

    nome_completo = models.CharField(max_length=180)
    cpf = models.CharField(max_length=14, unique=True)
    rg = models.CharField(max_length=30, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    sexo = models.CharField(max_length=12, choices=Sexo.choices)
    publico = models.CharField(max_length=20, choices=Publico.choices)
    telefone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    endereco = models.CharField(max_length=255, blank=True)
    comunidade = models.CharField(max_length=150, blank=True)
    observacoes = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)
    cadastrado_por = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="produtores_cadastrados",
    )
    data_cadastro = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome_completo"]

    def __str__(self):
        return self.nome_completo
