from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.agricultura.models import Cultura
from apps.agricultura.serializers import CulturaSerializer
from apps.carteira.models import Carteira
from apps.carteira.serializers import CarteiraSerializer
from apps.core.permissions import RolePermission
from apps.criacao_animal.models import CriacaoAnimal
from apps.criacao_animal.serializers import CriacaoAnimalSerializer
from apps.localizacao.models import Localizacao
from apps.localizacao.serializers import LocalizacaoSerializer
from apps.meliponicultura.models import Meliponicultura
from apps.meliponicultura.serializers import MeliponiculturaSerializer
from apps.paa.models import PAA
from apps.paa.serializers import PAASerializer
from apps.produtores.models import Produtor
from apps.produtores.serializers import ProdutorSerializer
from apps.registro.models import Registro
from apps.registro.serializers import RegistroSerializer


class ProdutorFilter(filters.FilterSet):
    zona = filters.CharFilter(field_name="localizacao__tipo_localizacao")
    cultura = filters.CharFilter(field_name="culturas__nome_cultura", lookup_expr="icontains")
    status_registro = filters.CharFilter(field_name="registro__status")

    class Meta:
        model = Produtor
        fields = ["sexo", "publico", "comunidade", "ativo", "zona", "cultura", "status_registro"]


class ProdutorViewSet(viewsets.ModelViewSet):
    queryset = (
        Produtor.objects.select_related("registro", "localizacao", "paa", "cadastrado_por")
        .prefetch_related("culturas", "carteiras", "criacoes_animais", "meliponiculturas")
        .all()
    )
    serializer_class = ProdutorSerializer
    permission_classes = [RolePermission]
    filterset_class = ProdutorFilter
    search_fields = [
        "nome_completo",
        "cpf",
        "comunidade",
        "publico",
        "sexo",
        "localizacao__tipo_localizacao",
        "culturas__nome_cultura",
        "registro__status",
    ]
    ordering_fields = ["nome_completo", "data_cadastro", "atualizado_em"]

    def perform_create(self, serializer):
        serializer.save(cadastrado_por=self.request.user)

    @action(detail=True, methods=["post"], url_path="desativar")
    def desativar(self, request, pk=None):
        produtor = self.get_object()
        produtor.ativo = False
        produtor.save(update_fields=["ativo", "atualizado_em"])
        return Response(self.get_serializer(produtor).data)

    @action(detail=True, methods=["get", "post"], url_path="culturas")
    def culturas(self, request, pk=None):
        produtor = self.get_object()
        if request.method == "GET":
            serializer = CulturaSerializer(produtor.culturas.all(), many=True)
            return Response(serializer.data)

        serializer = CulturaSerializer(data={**request.data, "produtor": produtor.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post", "put", "patch"], url_path="registro")
    def registro(self, request, pk=None):
        produtor = self.get_object()
        instance = getattr(produtor, "registro", None)

        if request.method == "GET":
            if not instance:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(RegistroSerializer(instance).data)

        data = {**request.data, "produtor": produtor.id}
        serializer = RegistroSerializer(instance, data=data, partial=request.method == "PATCH")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post"], url_path="carteira")
    def carteira(self, request, pk=None):
        produtor = self.get_object()
        if request.method == "GET":
            serializer = CarteiraSerializer(produtor.carteiras.all(), many=True)
            return Response(serializer.data)

        data = {**request.data, "produtor": produtor.id}
        if "registro" not in data and hasattr(produtor, "registro"):
            data["registro"] = produtor.registro.id
        serializer = CarteiraSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post", "put", "patch"], url_path="localizacao")
    def localizacao(self, request, pk=None):
        produtor = self.get_object()
        instance = getattr(produtor, "localizacao", None)
        if request.method == "GET":
            if not instance:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(LocalizacaoSerializer(instance).data)

        serializer = LocalizacaoSerializer(
            instance,
            data={**request.data, "produtor": produtor.id},
            partial=request.method == "PATCH",
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post", "put", "patch"], url_path="paa")
    def paa(self, request, pk=None):
        produtor = self.get_object()
        instance = getattr(produtor, "paa", None)
        if request.method == "GET":
            if not instance:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(PAASerializer(instance).data)

        serializer = PAASerializer(
            instance,
            data={**request.data, "produtor": produtor.id},
            partial=request.method == "PATCH",
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post"], url_path="criacao-animal")
    def criacao_animal(self, request, pk=None):
        produtor = self.get_object()
        if request.method == "GET":
            serializer = CriacaoAnimalSerializer(produtor.criacoes_animais.all(), many=True)
            return Response(serializer.data)

        serializer = CriacaoAnimalSerializer(data={**request.data, "produtor": produtor.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post"], url_path="meliponicultura")
    def meliponicultura(self, request, pk=None):
        produtor = self.get_object()
        if request.method == "GET":
            serializer = MeliponiculturaSerializer(produtor.meliponiculturas.all(), many=True)
            return Response(serializer.data)

        serializer = MeliponiculturaSerializer(data={**request.data, "produtor": produtor.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
