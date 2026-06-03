from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.documentos.models import DocumentoEmitido
from apps.documentos.serializers import DocumentoEmitidoSerializer


class DocumentoEmitidoViewSet(viewsets.ModelViewSet):
    queryset = DocumentoEmitido.objects.select_related("produtor", "gerado_por").all()
    serializer_class = DocumentoEmitidoSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor_nome", "produtor_cpf", "tipo_documento", "gerado_por_nome"]
    filterset_fields = ["produtor", "tipo_documento", "gerado_por"]
