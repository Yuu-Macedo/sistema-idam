from rest_framework import serializers

from apps.agricultura.models import Cultura


class CulturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cultura
        fields = [
            "id",
            "produtor",
            "nome_cultura",
            "subtipo",
            "area_plantada",
            "unidade_area",
            "quantidade_produzida",
            "unidade_producao",
            "formula_calculo",
            "resultado_calculo",
            "producao_organica",
            "observacoes",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "resultado_calculo", "criado_em", "atualizado_em"]

    def validate(self, attrs):
        area = attrs.get("area_plantada", getattr(self.instance, "area_plantada", 0))
        quantidade = attrs.get(
            "quantidade_produzida",
            getattr(self.instance, "quantidade_produzida", 0),
        )
        if area is not None and area < 0:
            raise serializers.ValidationError({"area_plantada": "Área não pode ser negativa."})
        if quantidade is not None and quantidade < 0:
            raise serializers.ValidationError(
                {"quantidade_produzida": "Quantidade não pode ser negativa."}
            )
        return attrs
