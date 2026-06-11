from rest_framework import serializers

from apps.documentos.models import DocumentoEmitido


class DocumentoEmitidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoEmitido
        fields = "__all__"
        read_only_fields = ["id", "data_geracao"]
