from rest_framework import viewsets

from apps.comunidades.models import Comunidade
from apps.comunidades.serializers import ComunidadeSerializer
from apps.core.permissions import RolePermission


class ComunidadeViewSet(viewsets.ModelViewSet):
    queryset = Comunidade.objects.all()
    serializer_class = ComunidadeSerializer
    permission_classes = [RolePermission]
    search_fields = ["nome", "municipio", "localizacao"]
    filterset_fields = ["municipio"]
