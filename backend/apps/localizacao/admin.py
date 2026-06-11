from django.contrib import admin

from apps.localizacao.models import Localizacao


@admin.register(Localizacao)
class LocalizacaoAdmin(admin.ModelAdmin):
    list_display = ("produtor", "tipo_localizacao", "comunidade", "acesso")
    search_fields = ("produtor__nome_completo", "comunidade", "endereco")
    list_filter = ("tipo_localizacao", "comunidade")
