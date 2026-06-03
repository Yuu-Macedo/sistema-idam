from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.paa.models import PAA
from apps.paa.serializers import PAASerializer


class PAAViewSet(viewsets.ModelViewSet):
    queryset = PAA.objects.select_related("produtor").all()
    serializer_class = PAASerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor__nome_completo", "perfil", "dados_propriedade"]
    filterset_fields = ["produtor", "participa_paa", "perfil"]
