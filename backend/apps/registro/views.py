from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.registro.models import Registro
from apps.registro.serializers import RegistroSerializer


class RegistroViewSet(viewsets.ModelViewSet):
    queryset = Registro.objects.select_related("produtor").all()
    serializer_class = RegistroSerializer
    permission_classes = [RolePermission]
    search_fields = ["numero_registro", "produtor__nome_completo", "produtor__cpf"]
    filterset_fields = ["produtor", "possui_carteira", "status", "data_registro"]
    ordering_fields = ["data_registro", "numero_registro", "status"]
