from rest_framework import serializers

from apps.comunidades.models import Comunidade


class ComunidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidade
        fields = "__all__"
        read_only_fields = ["id", "data_cadastro", "atualizado_em"]
