from django.contrib import admin

from apps.criacao_animal.models import Avicultura, CriacaoAnimal


@admin.register(CriacaoAnimal)
class CriacaoAnimalAdmin(admin.ModelAdmin):
    list_display = ("produtor", "tipo_criacao", "sistema_criacao", "producao_organica")
    search_fields = ("produtor__nome_completo", "tipo_criacao")


@admin.register(Avicultura)
class AviculturaAdmin(admin.ModelAdmin):
    list_display = ("criacao_animal", "especie", "quantidade", "finalidade")
    list_filter = ("especie",)
