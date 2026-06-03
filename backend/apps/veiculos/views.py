from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.veiculos.models import Veiculo
from apps.veiculos.serializers import VeiculoSerializer


class VeiculoViewSet(viewsets.ModelViewSet):
    queryset = Veiculo.objects.select_related("tecnico_em_uso").all()
    serializer_class = VeiculoSerializer
    permission_classes = [RolePermission]
    search_fields = ["placa", "modelo", "marca", "tipo", "status"]
    filterset_fields = ["status", "tipo", "tecnico_em_uso"]
