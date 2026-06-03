from rest_framework import serializers

from apps.veiculos.models import Veiculo


class VeiculoSerializer(serializers.ModelSerializer):
    tecnico_em_uso_nome = serializers.CharField(source="tecnico_em_uso.nome", read_only=True)

    class Meta:
        model = Veiculo
        fields = "__all__"
        read_only_fields = ["id", "data_cadastro", "atualizado_em", "tecnico_em_uso_nome"]
