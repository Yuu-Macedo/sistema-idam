from rest_framework import serializers

from apps.cronogramas.models import CronogramaVisita


class CronogramaVisitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CronogramaVisita
        fields = "__all__"
        read_only_fields = ["id", "data_criacao", "atualizado_em"]
