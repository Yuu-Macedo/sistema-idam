from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.accounts.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Dados IDAM", {"fields": ("nome", "cargo", "telefone", "tipo_usuario", "ativo")}),
    )
    list_display = ("email", "nome", "tipo_usuario", "ativo", "is_staff")
    list_filter = ("tipo_usuario", "ativo", "is_staff")
    search_fields = ("email", "nome", "username")
