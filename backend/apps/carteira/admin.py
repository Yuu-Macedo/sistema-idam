from django.contrib import admin

from apps.carteira.models import Carteira


@admin.register(Carteira)
class CarteiraAdmin(admin.ModelAdmin):
    list_display = ("numero_carteira", "tipo_carteira", "produtor", "orgao_emissor", "data_validade")
    search_fields = ("numero_carteira", "produtor__nome_completo")
