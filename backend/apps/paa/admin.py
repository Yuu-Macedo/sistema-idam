from django.contrib import admin

from apps.paa.models import PAA


@admin.register(PAA)
class PAAAdmin(admin.ModelAdmin):
    list_display = ("produtor", "participa_paa", "perfil")
    list_filter = ("participa_paa", "perfil")
