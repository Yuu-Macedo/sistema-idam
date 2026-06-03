from django.contrib import admin

from apps.atendimentos.models import Atendimento


@admin.register(Atendimento)
class AtendimentoAdmin(admin.ModelAdmin):
    list_display = ("produtor_nome", "tecnico_responsavel", "data", "tipo")
    search_fields = ("produtor_nome", "produtor_cpf", "tecnico_responsavel")
