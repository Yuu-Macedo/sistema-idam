from rest_framework import viewsets

from apps.carteira.models import Carteira
from apps.carteira.serializers import CarteiraSerializer
from apps.core.permissions import RolePermission


class CarteiraViewSet(viewsets.ModelViewSet):
    queryset = Carteira.objects.select_related("produtor", "registro").all()
    serializer_class = CarteiraSerializer
    permission_classes = [RolePermission]
    search_fields = ["numero_carteira", "tipo_carteira", "orgao_emissor", "produtor__nome_completo"]
    filterset_fields = ["produtor", "registro", "tipo_carteira", "orgao_emissor"]
    ordering_fields = ["data_emissao", "data_validade", "numero_carteira"]
