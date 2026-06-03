from django.contrib import admin

from apps.comunidades.models import Comunidade


@admin.register(Comunidade)
class ComunidadeAdmin(admin.ModelAdmin):
    list_display = ("nome", "municipio", "localizacao")
    search_fields = ("nome", "municipio", "localizacao")
