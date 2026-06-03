from rest_framework import serializers

from apps.registro.models import Registro


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = [
            "id",
            "produtor",
            "numero_registro",
            "data_registro",
            "possui_carteira",
            "status",
            "observacoes",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_em", "atualizado_em"]

    def validate(self, attrs):
        # Campos de carteira não são obrigatórios aqui. A carteira é validada
        # somente quando o registro declara possui_carteira=True e o usuário
        # tenta criar/atualizar uma carteira.
        return attrs
