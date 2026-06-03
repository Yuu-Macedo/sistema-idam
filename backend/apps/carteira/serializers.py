from rest_framework import serializers

from apps.carteira.models import Carteira


class CarteiraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carteira
        fields = [
            "id",
            "produtor",
            "registro",
            "numero_carteira",
            "tipo_carteira",
            "data_emissao",
            "data_validade",
            "orgao_emissor",
            "observacoes",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_em", "atualizado_em"]

    def validate(self, attrs):
        registro = attrs.get("registro", getattr(self.instance, "registro", None))
        if registro and not registro.possui_carteira:
            raise serializers.ValidationError(
                "Carteira só pode ser vinculada a registros com possui_carteira=True."
            )
        return attrs
