from django.db import models


class CriacaoAnimal(models.Model):
    produtor = models.ForeignKey(
        "produtores.Produtor",
        on_delete=models.CASCADE,
        related_name="criacoes_animais",
    )
    tipo_criacao = models.CharField(max_length=100)
    sistema_criacao = models.CharField(max_length=120, blank=True)
    producao_organica = models.BooleanField(default=False)
    observacoes = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.tipo_criacao


class Avicultura(models.Model):
    class Especie(models.TextChoices):
        GALINHA = "galinha", "Galinha"
        PATO = "pato", "Pato"
        CODORNA = "codorna", "Codorna"

    criacao_animal = models.ForeignKey(
        CriacaoAnimal,
        on_delete=models.CASCADE,
        related_name="aviculturas",
    )
    especie = models.CharField(max_length=20, choices=Especie.choices)
    quantidade = models.PositiveIntegerField(default=0)
    finalidade = models.CharField(max_length=120, blank=True)
    observacoes = models.TextField(blank=True)

    def __str__(self):
        return self.get_especie_display()
