from rest_framework import serializers

from apps.meliponicultura.models import EspecieAbelha, Meliponicultura


class EspecieAbelhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EspecieAbelha
        fields = "__all__"
        read_only_fields = ["id"]


class MeliponiculturaSerializer(serializers.ModelSerializer):
    especie_detalhes = EspecieAbelhaSerializer(source="especie", read_only=True)

    class Meta:
        model = Meliponicultura
        fields = [
            "id",
            "produtor",
            "especie",
            "especie_detalhes",
            "quantidade_colmeias",
            "producao_mel",
            "unidade_producao",
            "observacoes",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_em", "atualizado_em"]

    def validate_especie(self, especie):
        if not especie.ativa:
            raise serializers.ValidationError("Espécie de abelha inativa.")
        return especie
