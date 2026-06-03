from rest_framework import viewsets

from apps.agricultura.models import Cultura
from apps.agricultura.serializers import CulturaSerializer
from apps.core.permissions import RolePermission


class CulturaViewSet(viewsets.ModelViewSet):
    queryset = Cultura.objects.select_related("produtor").all()
    serializer_class = CulturaSerializer
    permission_classes = [RolePermission]
    search_fields = ["nome_cultura", "subtipo", "produtor__nome_completo"]
    filterset_fields = ["produtor", "subtipo", "producao_organica", "unidade_producao"]
    ordering_fields = ["nome_cultura", "area_plantada", "quantidade_produzida", "resultado_calculo"]
