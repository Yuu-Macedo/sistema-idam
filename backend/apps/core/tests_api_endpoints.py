from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class ExtraEndpointTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_user(
            username="admin-extra",
            email="admin-extra@idam.local",
            password="senha-forte-123",
            nome="Admin Extra",
            tipo_usuario="administrador",
        )
        self.client.force_authenticate(self.admin)

    def test_cria_comunidade(self):
        response = self.client.post(
            reverse("comunidades-list"),
            {"nome": "São José", "municipio": "Manaus", "localizacao": "Ramal 1"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cria_veiculo(self):
        response = self.client.post(
            reverse("veiculos-list"),
            {
                "placa": "ABC1D23",
                "modelo": "Hilux",
                "marca": "Toyota",
                "status": "Disponível",
                "gasolina": 80,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cria_cronograma(self):
        response = self.client.post(
            reverse("cronogramas-list"),
            {
                "produtor_nome": "Maria",
                "tecnico_nome": "Admin Extra",
                "dia_semana": "segunda",
                "turno": "manha",
                "atividade": "Visita técnica",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cria_recomendacao(self):
        response = self.client.post(
            reverse("recomendacoes-tecnicas-list"),
            {
                "produtor_nome": "Maria",
                "produtor_cpf": "12345678901",
                "recomendacao": "Acompanhar plantio.",
                "tecnico_responsavel": "Admin Extra",
                "data": "2026-06-02",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cria_atendimento(self):
        response = self.client.post(
            reverse("atendimentos-list"),
            {
                "produtor_nome": "Maria",
                "produtor_cpf": "12345678901",
                "tecnico_responsavel": "Admin Extra",
                "data": "2026-06-02",
                "tipo": "Cadastro",
                "descricao": "Atendimento inicial",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cria_documento_emitido(self):
        response = self.client.post(
            reverse("documentos-emitidos-list"),
            {
                "produtor_nome": "Maria",
                "produtor_cpf": "12345678901",
                "tipo_documento": "Declaração oficial",
                "gerado_por_nome": "Admin Extra",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
