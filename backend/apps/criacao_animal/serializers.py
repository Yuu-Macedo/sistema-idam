from rest_framework import serializers

from apps.criacao_animal.models import Avicultura, CriacaoAnimal


class AviculturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avicultura
        fields = "__all__"
        read_only_fields = ["id"]


class CriacaoAnimalSerializer(serializers.ModelSerializer):
    aviculturas = AviculturaSerializer(many=True, read_only=True)

    class Meta:
        model = CriacaoAnimal
        fields = [
            "id",
            "produtor",
            "tipo_criacao",
            "sistema_criacao",
            "producao_organica",
            "observacoes",
            "aviculturas",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_em", "atualizado_em"]
