from rest_framework import serializers

from apps.recomendacoes.models import RecomendacaoTecnica


class RecomendacaoTecnicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecomendacaoTecnica
        fields = "__all__"
        read_only_fields = ["id", "data_criacao", "atualizado_em"]
