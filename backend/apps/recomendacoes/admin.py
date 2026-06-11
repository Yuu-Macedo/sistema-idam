from django.contrib import admin

from apps.recomendacoes.models import RecomendacaoTecnica


@admin.register(RecomendacaoTecnica)
class RecomendacaoTecnicaAdmin(admin.ModelAdmin):
    list_display = ("produtor_nome", "tecnico_responsavel", "data")
    search_fields = ("produtor_nome", "produtor_cpf", "recomendacao")
