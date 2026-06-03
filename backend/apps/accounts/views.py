from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.serializers import LoginSerializer, LogoutSerializer, UserSerializer
from apps.core.permissions import UserManagementPermission

User = get_user_model()


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = []


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=UserSerializer)
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=LogoutSerializer, responses=None)
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh = serializer.validated_data["refresh"]
        token = RefreshToken(refresh)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("nome")
    serializer_class = UserSerializer
    permission_classes = [UserManagementPermission]
    search_fields = ["nome", "email", "username", "cargo", "tipo_usuario"]
    filterset_fields = ["tipo_usuario", "ativo"]
