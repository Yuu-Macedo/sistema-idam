from rest_framework import serializers

from apps.atendimentos.models import Atendimento


class AtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atendimento
        fields = "__all__"
        read_only_fields = ["id", "criado_em", "atualizado_em"]
