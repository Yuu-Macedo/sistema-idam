from rest_framework import viewsets

from apps.atendimentos.models import Atendimento
from apps.atendimentos.serializers import AtendimentoSerializer
from apps.core.permissions import RolePermission


class AtendimentoViewSet(viewsets.ModelViewSet):
    queryset = Atendimento.objects.select_related("produtor", "tecnico").all()
    serializer_class = AtendimentoSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor_nome", "produtor_cpf", "tecnico_responsavel", "tipo", "descricao"]
    filterset_fields = ["produtor", "tecnico", "data", "tipo"]
