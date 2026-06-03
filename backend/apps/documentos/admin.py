from django.contrib import admin

from apps.documentos.models import DocumentoEmitido


@admin.register(DocumentoEmitido)
class DocumentoEmitidoAdmin(admin.ModelAdmin):
    list_display = ("tipo_documento", "produtor_nome", "gerado_por_nome", "data_geracao")
    search_fields = ("tipo_documento", "produtor_nome", "produtor_cpf")
