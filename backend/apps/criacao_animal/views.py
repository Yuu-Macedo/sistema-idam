from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.criacao_animal.models import Avicultura, CriacaoAnimal
from apps.criacao_animal.serializers import AviculturaSerializer, CriacaoAnimalSerializer


class CriacaoAnimalViewSet(viewsets.ModelViewSet):
    queryset = CriacaoAnimal.objects.select_related("produtor").prefetch_related("aviculturas")
    serializer_class = CriacaoAnimalSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor__nome_completo", "tipo_criacao", "sistema_criacao"]
    filterset_fields = ["produtor", "tipo_criacao", "sistema_criacao", "producao_organica"]


class AviculturaViewSet(viewsets.ModelViewSet):
    queryset = Avicultura.objects.select_related("criacao_animal", "criacao_animal__produtor")
    serializer_class = AviculturaSerializer
    permission_classes = [RolePermission]
    search_fields = ["especie", "finalidade", "criacao_animal__produtor__nome_completo"]
    filterset_fields = ["criacao_animal", "especie", "finalidade"]
