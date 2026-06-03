from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAuthenticatedAndActive(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.ativo)


class RolePermission(BasePermission):
    """
    Administrador: acesso total.
    Técnico: cria e edita, sem excluir.
    Visualizador: apenas leitura.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated or not user.ativo:
            return False

        if user.tipo_usuario == "administrador" or user.is_superuser:
            return True

        if user.tipo_usuario == "visualizador":
            return request.method in SAFE_METHODS

        if user.tipo_usuario == "tecnico":
            return request.method != "DELETE"

        return False


class UserManagementPermission(BasePermission):
    """
    Administra o acesso ao endpoint de usuarios.
    Administradores gerenciam usuarios; demais perfis acessam apenas o proprio
    cadastro para evitar elevacao de privilegio via chamada direta a API.
    """

    SELF_ACTIONS = {"retrieve", "update", "partial_update"}

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated or not user.ativo:
            return False

        if user.tipo_usuario == "administrador" or user.is_superuser:
            return True

        return getattr(view, "action", None) in self.SELF_ACTIONS

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.tipo_usuario == "administrador" or user.is_superuser:
            return True

        return getattr(view, "action", None) in self.SELF_ACTIONS and obj.pk == user.pk
