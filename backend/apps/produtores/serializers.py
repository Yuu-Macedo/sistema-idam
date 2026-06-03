from rest_framework import serializers

from apps.agricultura.serializers import CulturaSerializer
from apps.carteira.serializers import CarteiraSerializer
from apps.core.validators import validate_cpf
from apps.criacao_animal.serializers import CriacaoAnimalSerializer
from apps.localizacao.serializers import LocalizacaoSerializer
from apps.meliponicultura.serializers import MeliponiculturaSerializer
from apps.paa.serializers import PAASerializer
from apps.produtores.models import Produtor
from apps.registro.serializers import RegistroSerializer


class ProdutorSerializer(serializers.ModelSerializer):
    cpf = serializers.CharField(validators=[validate_cpf])
    culturas = CulturaSerializer(many=True, read_only=True)
    registro = RegistroSerializer(read_only=True)
    carteiras = CarteiraSerializer(many=True, read_only=True)
    localizacao = LocalizacaoSerializer(read_only=True)
    paa = PAASerializer(read_only=True)
    criacoes_animais = CriacaoAnimalSerializer(many=True, read_only=True)
    meliponiculturas = MeliponiculturaSerializer(many=True, read_only=True)

    class Meta:
        model = Produtor
        fields = [
            "id",
            "nome_completo",
            "cpf",
            "rg",
            "data_nascimento",
            "sexo",
            "publico",
            "telefone",
            "email",
            "endereco",
            "comunidade",
            "observacoes",
            "ativo",
            "cadastrado_por",
            "data_cadastro",
            "atualizado_em",
            "culturas",
            "registro",
            "carteiras",
            "localizacao",
            "paa",
            "criacoes_animais",
            "meliponiculturas",
        ]
        read_only_fields = ["id", "cadastrado_por", "data_cadastro", "atualizado_em"]
