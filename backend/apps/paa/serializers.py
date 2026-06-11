from rest_framework import serializers

from apps.paa.models import PAA


class PAASerializer(serializers.ModelSerializer):
    class Meta:
        model = PAA
        fields = "__all__"
        read_only_fields = ["id", "criado_em", "atualizado_em"]
