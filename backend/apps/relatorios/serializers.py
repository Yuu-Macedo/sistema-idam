from rest_framework import serializers


class LabelValueSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.DecimalField(max_digits=14, decimal_places=2)


class DashboardTotalsSerializer(serializers.Serializer):
    produtores = serializers.IntegerField()
    culturas = serializers.IntegerField()
    registros = serializers.IntegerField()
    produtores_ativos = serializers.IntegerField()


class DashboardReportSerializer(serializers.Serializer):
    totais = DashboardTotalsSerializer()
    produtores_por_sexo = LabelValueSerializer(many=True)
    produtores_por_publico = LabelValueSerializer(many=True)
    produtores_por_zona = LabelValueSerializer(many=True)
    producao_por_cultura = LabelValueSerializer(many=True)
    criacao_animal_por_tipo = LabelValueSerializer(many=True)
