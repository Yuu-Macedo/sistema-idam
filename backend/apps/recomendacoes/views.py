from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.recomendacoes.models import RecomendacaoTecnica
from apps.recomendacoes.serializers import RecomendacaoTecnicaSerializer


class RecomendacaoTecnicaViewSet(viewsets.ModelViewSet):
    queryset = RecomendacaoTecnica.objects.select_related("produtor", "tecnico", "criado_por").all()
    serializer_class = RecomendacaoTecnicaSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor_nome", "produtor_cpf", "recomendacao", "tecnico_responsavel"]
    filterset_fields = ["produtor", "tecnico", "data"]
