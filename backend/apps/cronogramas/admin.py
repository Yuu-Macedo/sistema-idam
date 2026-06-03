from django.contrib import admin

from apps.cronogramas.models import CronogramaVisita


@admin.register(CronogramaVisita)
class CronogramaVisitaAdmin(admin.ModelAdmin):
    list_display = ("atividade", "produtor_nome", "tecnico_nome", "dia_semana", "turno")
    search_fields = ("atividade", "produtor_nome", "tecnico_nome")
    list_filter = ("dia_semana", "turno")
