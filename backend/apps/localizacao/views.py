from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.localizacao.models import Localizacao
from apps.localizacao.serializers import LocalizacaoSerializer


class LocalizacaoViewSet(viewsets.ModelViewSet):
    queryset = Localizacao.objects.select_related("produtor").all()
    serializer_class = LocalizacaoSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor__nome_completo", "comunidade", "endereco", "acesso"]
    filterset_fields = ["produtor", "tipo_localizacao", "comunidade"]
