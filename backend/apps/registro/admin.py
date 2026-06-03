from django.contrib import admin

from apps.registro.models import Registro


@admin.register(Registro)
class RegistroAdmin(admin.ModelAdmin):
    list_display = ("numero_registro", "produtor", "data_registro", "possui_carteira", "status")
    search_fields = ("numero_registro", "produtor__nome_completo", "produtor__cpf")
    list_filter = ("possui_carteira", "status")
