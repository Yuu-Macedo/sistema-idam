from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.meliponicultura.models import EspecieAbelha, Meliponicultura
from apps.meliponicultura.serializers import EspecieAbelhaSerializer, MeliponiculturaSerializer


class EspecieAbelhaViewSet(viewsets.ModelViewSet):
    queryset = EspecieAbelha.objects.all()
    serializer_class = EspecieAbelhaSerializer
    permission_classes = [RolePermission]
    search_fields = ["nome_popular", "nome_cientifico", "tipo_abelha"]
    filterset_fields = ["tipo_abelha", "ativa"]


class MeliponiculturaViewSet(viewsets.ModelViewSet):
    queryset = Meliponicultura.objects.select_related("produtor", "especie").all()
    serializer_class = MeliponiculturaSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor__nome_completo", "especie__nome_popular", "especie__nome_cientifico"]
    filterset_fields = ["produtor", "especie", "unidade_producao"]
