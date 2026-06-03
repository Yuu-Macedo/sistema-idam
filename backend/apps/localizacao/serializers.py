from rest_framework import serializers

from apps.localizacao.models import Localizacao


class LocalizacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localizacao
        fields = "__all__"
        read_only_fields = ["id", "criado_em", "atualizado_em"]
