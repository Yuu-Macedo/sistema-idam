from django.contrib import admin

from apps.veiculos.models import Veiculo


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ("placa", "modelo", "status", "gasolina", "tecnico_em_uso")
    search_fields = ("placa", "modelo", "marca")
    list_filter = ("status", "tipo")
