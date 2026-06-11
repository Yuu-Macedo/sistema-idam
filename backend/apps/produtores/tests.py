from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.agricultura.models import Cultura
from apps.produtores.models import Produtor
from apps.registro.models import Registro


class ProdutorApiTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@idam.local",
            password="senha-forte-123",
            nome="Administrador",
            tipo_usuario="administrador",
        )
        self.viewer = User.objects.create_user(
            username="viewer",
            email="viewer@idam.local",
            password="senha-forte-123",
            nome="Visualizador",
            tipo_usuario="visualizador",
        )
        self.client.force_authenticate(self.admin)

    def produtor_payload(self, cpf="52998224725"):
        return {
            "nome_completo": "Maria da Silva",
            "cpf": cpf,
            "sexo": "feminino",
            "publico": "mulher_adulta",
            "telefone": "92999990000",
            "comunidade": "Comunidade Central",
        }

    def test_criacao_de_produtor(self):
        response = self.client.post(reverse("produtores-list"), self.produtor_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Produtor.objects.count(), 1)

    def test_rejeita_cpf_com_digitos_verificadores_invalidos(self):
        response = self.client.post(reverse("produtores-list"), self.produtor_payload("52998224724"), format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cpf", response.data)

    def test_listagem_de_produtores(self):
        Produtor.objects.create(**self.produtor_payload(), cadastrado_por=self.admin)

        response = self.client.get(reverse("produtores-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_cadastro_de_cultura_por_produtor(self):
        produtor = Produtor.objects.create(**self.produtor_payload(), cadastrado_por=self.admin)

        response = self.client.post(
            reverse("produtores-culturas", kwargs={"pk": produtor.id}),
            {
                "nome_cultura": "Mandioca",
                "subtipo": "mandioca",
                "area_plantada": "2.00",
                "quantidade_produzida": "1000.00",
                "unidade_producao": "kg",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cultura.objects.count(), 1)
        self.assertEqual(str(Cultura.objects.first().resultado_calculo), "500.00")

    def test_registro_sem_carteira_finaliza(self):
        produtor = Produtor.objects.create(**self.produtor_payload(), cadastrado_por=self.admin)

        response = self.client.post(
            reverse("produtores-registro", kwargs={"pk": produtor.id}),
            {
                "numero_registro": "REG-001",
                "data_registro": "2026-06-01",
                "possui_carteira": False,
                "status": "finalizado",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Registro.objects.filter(status="finalizado").exists())

    def test_registro_com_carteira(self):
        produtor = Produtor.objects.create(**self.produtor_payload(), cadastrado_por=self.admin)
        registro = Registro.objects.create(
            produtor=produtor,
            numero_registro="REG-002",
            data_registro="2026-06-01",
            possui_carteira=True,
            status="finalizado",
        )

        response = self.client.post(
            reverse("produtores-carteira", kwargs={"pk": produtor.id}),
            {
                "registro": registro.id,
                "numero_carteira": "CAR-001",
                "tipo_carteira": "Produtor rural",
                "orgao_emissor": "IDAM",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_visualizador_nao_cria_produtor(self):
        self.client.force_authenticate(self.viewer)

        response = self.client.post(reverse("produtores-list"), self.produtor_payload("11144477735"), format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
