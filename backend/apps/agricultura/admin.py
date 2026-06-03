from django.contrib import admin

from apps.agricultura.models import Cultura


@admin.register(Cultura)
class CulturaAdmin(admin.ModelAdmin):
    list_display = ("nome_cultura", "produtor", "subtipo", "quantidade_produzida", "resultado_calculo")
    search_fields = ("nome_cultura", "produtor__nome_completo")
    list_filter = ("subtipo", "producao_organica")
