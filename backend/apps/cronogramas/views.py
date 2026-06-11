from rest_framework import viewsets

from apps.core.permissions import RolePermission
from apps.cronogramas.models import CronogramaVisita
from apps.cronogramas.serializers import CronogramaVisitaSerializer


class CronogramaVisitaViewSet(viewsets.ModelViewSet):
    queryset = CronogramaVisita.objects.select_related("produtor", "tecnico", "criado_por").all()
    serializer_class = CronogramaVisitaSerializer
    permission_classes = [RolePermission]
    search_fields = ["produtor_nome", "tecnico_nome", "atividade", "dia_semana"]
    filterset_fields = ["produtor", "tecnico", "dia_semana", "turno"]
