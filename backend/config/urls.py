from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import LoginView, LogoutView, MeView, UserViewSet
from apps.agricultura.views import CulturaViewSet
from apps.atendimentos.views import AtendimentoViewSet
from apps.carteira.views import CarteiraViewSet
from apps.comunidades.views import ComunidadeViewSet
from apps.cronogramas.views import CronogramaVisitaViewSet
from apps.criacao_animal.views import AviculturaViewSet, CriacaoAnimalViewSet
from apps.documentos.views import DocumentoEmitidoViewSet
from apps.localizacao.views import LocalizacaoViewSet
from apps.meliponicultura.views import EspecieAbelhaViewSet, MeliponiculturaViewSet
from apps.paa.views import PAAViewSet
from apps.produtores.views import ProdutorViewSet
from apps.recomendacoes.views import RecomendacaoTecnicaViewSet
from apps.registro.views import RegistroViewSet
from apps.relatorios.views import DashboardReportView
from apps.veiculos.views import VeiculoViewSet

router = DefaultRouter()
router.register("usuarios", UserViewSet, basename="usuarios")
router.register("produtores", ProdutorViewSet, basename="produtores")
router.register("culturas", CulturaViewSet, basename="culturas")
router.register("registros", RegistroViewSet, basename="registros")
router.register("carteiras", CarteiraViewSet, basename="carteiras")
router.register("localizacoes", LocalizacaoViewSet, basename="localizacoes")
router.register("criacoes-animais", CriacaoAnimalViewSet, basename="criacoes-animais")
router.register("avicultura", AviculturaViewSet, basename="avicultura")
router.register("paa", PAAViewSet, basename="paa")
router.register("especies-abelhas", EspecieAbelhaViewSet, basename="especies-abelhas")
router.register("meliponicultura", MeliponiculturaViewSet, basename="meliponicultura")
router.register("comunidades", ComunidadeViewSet, basename="comunidades")
router.register("veiculos", VeiculoViewSet, basename="veiculos")
router.register("cronogramas", CronogramaVisitaViewSet, basename="cronogramas")
router.register("recomendacoes-tecnicas", RecomendacaoTecnicaViewSet, basename="recomendacoes-tecnicas")
router.register("atendimentos", AtendimentoViewSet, basename="atendimentos")
router.register("documentos-emitidos", DocumentoEmitidoViewSet, basename="documentos-emitidos")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", MeView.as_view(), name="auth_me"),
    path("api/auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("api/relatorios/dashboard/", DashboardReportView.as_view(), name="dashboard_report"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/", include(router.urls)),
]
