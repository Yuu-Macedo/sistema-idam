from django.db.models import Count, Sum
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.agricultura.models import Cultura
from apps.core.permissions import RolePermission
from apps.criacao_animal.models import CriacaoAnimal
from apps.localizacao.models import Localizacao
from apps.produtores.models import Produtor
from apps.registro.models import Registro
from apps.relatorios.serializers import DashboardReportSerializer


def as_label_value(queryset, label_field: str, value_field: str = "total"):
    return [
        {"label": item[label_field] or "Não informado", "value": item[value_field]}
        for item in queryset
    ]


class DashboardReportView(APIView):
    permission_classes = [RolePermission]

    @extend_schema(responses=DashboardReportSerializer)
    def get(self, request):
        produtores_por_sexo = (
            Produtor.objects.values("sexo").annotate(total=Count("id")).order_by("-total")
        )
        produtores_por_publico = (
            Produtor.objects.values("publico").annotate(total=Count("id")).order_by("-total")
        )
        produtores_por_zona = (
            Localizacao.objects.values("tipo_localizacao").annotate(total=Count("id")).order_by("-total")
        )
        producao_por_cultura = (
            Cultura.objects.values("nome_cultura")
            .annotate(total=Sum("quantidade_produzida"))
            .order_by("-total")
        )
        criacao_por_tipo = (
            CriacaoAnimal.objects.values("tipo_criacao")
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        return Response(
            {
                "totais": {
                    "produtores": Produtor.objects.count(),
                    "culturas": Cultura.objects.count(),
                    "registros": Registro.objects.count(),
                    "produtores_ativos": Produtor.objects.filter(ativo=True).count(),
                },
                "produtores_por_sexo": as_label_value(produtores_por_sexo, "sexo"),
                "produtores_por_publico": as_label_value(produtores_por_publico, "publico"),
                "produtores_por_zona": as_label_value(produtores_por_zona, "tipo_localizacao"),
                "producao_por_cultura": as_label_value(producao_por_cultura, "nome_cultura"),
                "criacao_animal_por_tipo": as_label_value(criacao_por_tipo, "tipo_criacao"),
            }
        )
