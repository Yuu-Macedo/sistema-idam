from django.contrib import admin

from apps.produtores.models import Produtor


@admin.register(Produtor)
class ProdutorAdmin(admin.ModelAdmin):
    list_display = ("nome_completo", "cpf", "sexo", "publico", "comunidade", "ativo")
    search_fields = ("nome_completo", "cpf", "comunidade")
    list_filter = ("sexo", "publico", "ativo", "comunidade")
