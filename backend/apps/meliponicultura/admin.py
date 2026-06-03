from django.contrib import admin

from apps.meliponicultura.models import EspecieAbelha, Meliponicultura


@admin.register(EspecieAbelha)
class EspecieAbelhaAdmin(admin.ModelAdmin):
    list_display = ("nome_popular", "nome_cientifico", "tipo_abelha", "ativa")
    search_fields = ("nome_popular", "nome_cientifico", "tipo_abelha")
    list_filter = ("tipo_abelha", "ativa")


@admin.register(Meliponicultura)
class MeliponiculturaAdmin(admin.ModelAdmin):
    list_display = ("produtor", "especie", "quantidade_colmeias", "producao_mel")
    search_fields = ("produtor__nome_completo", "especie__nome_popular")
